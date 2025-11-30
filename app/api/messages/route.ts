import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { FROM_EMAIL, isResendConfigured, resend } from '@/lib/resend-client'

// GET - Récupérer les messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation_id')
    const reservationId = searchParams.get('reservation_id')

    let query = supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (conversationId) {
      query = query.eq('conversation_id', conversationId)
    }

    if (reservationId) {
      query = query.eq('reservation_id', reservationId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des messages:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des messages' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Envoyer un message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      )
    }

    // Envoyer un email au client lorsqu'un administrateur répond
    let emailNotification: 'sent' | 'skipped' | 'failed' | null = null

    if (body.expediteur_type === 'admin') {
      const { data: reservation, error: reservationError } = await supabaseAdmin
        .from('reservations')
        .select('client_email, client_nom, client_prenom, code, animal_nom')
        .eq('id', body.reservation_id)
        .single()

      if (reservationError || !reservation) {
        console.error('Reservation introuvable pour notification email:', reservationError)
        emailNotification = 'skipped'
      } else if (!isResendConfigured) {
        console.warn("Notification email ignorée: RESEND_API_KEY manquant")
        emailNotification = 'skipped'
      } else {
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: reservation.client_email,
            subject: `Nouveau message concernant ${reservation.animal_nom}`,
            html: `
            <p>Bonjour ${reservation.client_prenom ? `${reservation.client_prenom} ${reservation.client_nom}` : reservation.client_nom},</p>
            <p>Vous avez reçu un nouveau message dans votre espace Les Petits Bergers :</p>
            <blockquote style="border-left: 4px solid #000091; padding: 12px; margin: 16px 0; color: #1e1e1e;">${body.contenu}</blockquote>
            <p>Pour répondre ou suivre votre demande, utilisez votre code de réservation <strong>${reservation.code}</strong>.</p>
            <p>À très vite,<br>L'équipe Les Petits Bergers</p>
          `,
          })
          emailNotification = 'sent'
        } catch (emailError) {
          console.error("Echec d'envoi d'email messagerie:", emailError)
          emailNotification = 'failed'
        }
      }
    }

    return NextResponse.json(
      {
        ...data,
        emailNotification,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
