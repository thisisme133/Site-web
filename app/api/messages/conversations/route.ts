import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer toutes les conversations (liste pour l'admin)
export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les réservations avec leurs messages
    const { data: reservations, error: resError } = await supabaseAdmin
      .from('reservations')
      .select(`
        *,
        messages(*)
      `)
      .order('updated_at', { ascending: false })

    if (resError) {
      console.error('Erreur lors de la récupération des conversations:', resError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des conversations' },
        { status: 500 }
      )
    }

    // Transformer en format conversation
    const conversations = reservations.map((res: any) => {
      const messages = res.messages || []
      const lastMessage = messages[messages.length - 1]
      const unreadCount = messages.filter((m: any) => !m.lu && m.expediteur_type === 'client').length

      return {
        id: res.id,
        conversationId: `reservation-${res.id}`,
        reservationId: res.id,
        clientNom: res.client_nom,
        clientPrenom: res.client_prenom,
        animalNom: res.animal_nom,
        sujet: res.type === 'garde' ? 'Demande de garde' : 'Consultation comportementaliste',
        derniereActivite: lastMessage?.created_at || res.created_at,
        dernierMessage: lastMessage?.contenu || '',
        messagesNonLus: unreadCount,
        statut: res.statut,
      }
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
