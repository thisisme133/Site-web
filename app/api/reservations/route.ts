import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, emailTemplates, FROM_EMAIL } from '@/lib/resend-client'

// Générer un code de réservation unique
function generateReservationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// GET - Récupérer les réservations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const email = searchParams.get('email')
    const statut = searchParams.get('statut')

    let query = supabaseAdmin
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    if (code) {
      query = query.eq('code', code)
    }

    if (email) {
      query = query.eq('client_email', email)
    }

    if (statut) {
      query = query.eq('statut', statut)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des réservations' },
        { status: 500 }
      )
    }

    // Si c'est une recherche par code, retourner un seul résultat
    if (code && data.length > 0) {
      return NextResponse.json(data[0])
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

// POST - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Générer un code de réservation unique
    let code = generateReservationCode()
    let codeExists = true

    // Vérifier que le code est unique
    while (codeExists) {
      const { data } = await supabaseAdmin
        .from('reservations')
        .select('code')
        .eq('code', code)
        .single()

      if (!data) {
        codeExists = false
      } else {
        code = generateReservationCode()
      }
    }

    // Créer la réservation
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .insert({
        ...body,
        code,
        statut: 'en_attente',
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la réservation:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la réservation' },
        { status: 500 }
      )
    }

    // Envoyer l'email de confirmation
    try {
      const emailContent = emailTemplates.reservationConfirmation({
        clientNom: data.client_nom,
        animalNom: data.animal_nom,
        type: data.type,
        code: data.code,
        dateDebut: data.date_debut,
      })

      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.client_email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      // Ne pas bloquer la création même si l'email échoue
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
