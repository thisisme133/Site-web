import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer tous les chiens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const search = searchParams.get('search')
    const proprietaireId = searchParams.get('proprietaire_id')

    let query = supabaseAdmin
      .from('chiens')
      .select(`
        *,
        proprietaire:users!proprietaire_id(id, nom, prenom, email, telephone),
        visites(id, type, date_debut, montant)
      `)

    // Filtrer par statut
    if (statut) {
      query = query.eq('statut', statut)
    }

    // Filtrer par propriétaire
    if (proprietaireId) {
      query = query.eq('proprietaire_id', proprietaireId)
    }

    // Recherche par nom
    if (search) {
      query = query.ilike('nom', `%${search}%`)
    }

    query = query.order('nom', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des chiens:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des chiens' },
        { status: 500 }
      )
    }

    // Calculer les statistiques pour chaque chien
    const chiensAvecStats = data.map((chien: any) => ({
      ...chien,
      nbVisites: chien.visites?.length || 0,
      derniereVisite: chien.visites?.[0]?.date_debut || null,
      proprietaireNom: chien.proprietaire
        ? `${chien.proprietaire.prenom || ''} ${chien.proprietaire.nom || ''}`
        : 'Non défini',
    }))

    return NextResponse.json(chiensAvecStats)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau chien
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('chiens')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création du chien:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du chien' },
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
