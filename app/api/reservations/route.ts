import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, emailTemplates, FROM_EMAIL, isResendConfigured } from '@/lib/resend-client'

// Générer un code de réservation unique
function generateReservationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function parseNombre(value?: string | null): number | null {
  if (!value) return null
  const normalized = value.toString().replace(/[^0-9,.]/g, '').replace(',', '.')
  const parsed = parseFloat(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

async function createOrUpdateChienFromReservation(reservation: any) {
  if (!reservation?.animal_nom) return

  const payload: Record<string, any> = {
    nom: reservation.animal_nom,
    race: reservation.animal_race || reservation.form_data?.animalType || 'Non precisee',
    age: reservation.animal_age || (reservation.form_data?.animalAge ? `${reservation.form_data.animalAge} ans` : null),
    poids: parseNombre(reservation.animal_poids || reservation.form_data?.animalPoids),
    couleur: reservation.form_data?.robe || reservation.form_data?.coloration || null,
    numero_puce: reservation.form_data?.numeroPuce || reservation.form_data?.numero_puce || null,
    proprietaire_id: reservation.client_id || null,
    notes: reservation.form_data?.message || null,
    statut: 'actif',
  }

  const { data: existingChiens, error: fetchError } = await supabaseAdmin
    .from('chiens')
    .select('id')
    .eq('nom', payload.nom)
    .eq('race', payload.race)
    .limit(1)

  if (fetchError) {
    console.error('Erreur lors de la recherche du chien:', fetchError)
    return
  }

  const existingChien = Array.isArray(existingChiens) ? existingChiens[0] : null

  if (existingChien?.id) {
    const { error: updateError } = await supabaseAdmin
      .from('chiens')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', existingChien.id)

    if (updateError) {
      console.error('Erreur lors de la mise a jour du chien:', updateError)
    }
    return existingChien.id
  }

  const { data: newChien, error: insertError } = await supabaseAdmin
    .from('chiens')
    .insert(payload)
    .select('id')
    .single()

  if (insertError) {
    console.error('Erreur lors de la creation du chien:', insertError)
    return
  }

  return newChien?.id
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

    if (!isResendConfigured) {
      return NextResponse.json(
        {
          error:
            "L'envoi d'email est désactivé. Ajoutez RESEND_API_KEY (et idéalement RESEND_FROM_EMAIL) dans votre .env.local.",
        },
        { status: 500 }
      )
    }

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

    await createOrUpdateChienFromReservation(data)

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, message, piecesJointes } = body

    if (!id || !['accepter', 'refuser', 'demander_infos'].includes(action)) {
      return NextResponse.json(
        { error: "Action ou reservation invalide" },
        { status: 400 }
      )
    }

    const { data: reservation, error: fetchError } = await supabaseAdmin
      .from('reservations')
      .select('form_data')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Reservation introuvable:', fetchError)
      return NextResponse.json(
        { error: "Reservation introuvable" },
        { status: 404 }
      )
    }

    let statut = 'en_attente'
    let defaultMessage = 'Mise a jour de votre demande'

    switch (action) {
      case 'accepter':
        statut = 'confirmee'
        defaultMessage = 'Votre demande est acceptee'
        break
      case 'refuser':
        statut = 'annulee'
        defaultMessage = 'Votre demande ne peut pas etre acceptee pour le moment'
        break
      case 'demander_infos':
        statut = 'en_attente'
        defaultMessage = 'Nous avons besoin d'informations complementaires'
        break
    }

    const updatedFormData = reservation?.form_data || {}
    if (action === 'demander_infos') {
      updatedFormData.info_request = {
        message: message || defaultMessage,
        pieces_jointes: piecesJointes || [],
      }
    }

    const { data, error } = await supabaseAdmin
      .from('reservations')
      .update({
        statut,
        form_data: updatedFormData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise a jour de la reservation:', error)
      return NextResponse.json(
        { error: 'Impossible de mettre a jour la reservation' },
        { status: 500 }
      )
    }

    const contenu = message || defaultMessage

    const { error: messageError } = await supabaseAdmin.from('messages').insert({
      conversation_id: `reservation-${id}`,
      reservation_id: id,
      expediteur_type: 'admin',
      expediteur_nom: 'Les Petits Bergers',
      contenu,
      pieces_jointes: piecesJointes && piecesJointes.length > 0 ? piecesJointes : null,
    })

    if (messageError) {
      console.error('Erreur lors de la creation du message de suivi:', messageError)
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
