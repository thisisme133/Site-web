import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: { id: string }
}

export async function GET(
  _request: NextRequest,
  context: { params: RouteParams['params'] | Promise<RouteParams['params']> }
) {
  try {
    const { id } = (await context.params) as RouteParams['params']

    const uuidPattern = /^[0-9a-fA-F-]{36}$/

    if (!id || !uuidPattern.test(id)) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('chiens')
      .select(
        `
        *,
        proprietaire:users!proprietaire_id(id, nom, prenom, email, telephone, adresse, ville, code_postal),
        visites(id, type, date_debut, date_fin, duree, notes, montant, statut)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération du chien:', error)
      return NextResponse.json(
        { error: "Impossible de charger la fiche du chien" },
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
