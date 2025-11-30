import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer les visites (pour les statistiques/charts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chienId = searchParams.get('chien_id')
    const dateDebut = searchParams.get('date_debut')
    const dateFin = searchParams.get('date_fin')
    const type = searchParams.get('type')

    let query = supabaseAdmin
      .from('visites')
      .select(`
        *,
        chien:chiens!chien_id(id, nom, race)
      `)

    if (chienId) {
      query = query.eq('chien_id', chienId)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (dateDebut) {
      query = query.gte('date_debut', dateDebut)
    }

    if (dateFin) {
      query = query.lte('date_debut', dateFin)
    }

    query = query.order('date_debut', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des visites:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des visites' },
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

// POST - Créer une nouvelle visite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('visites')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la visite:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la visite' },
        { status: 500 }
      )
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
