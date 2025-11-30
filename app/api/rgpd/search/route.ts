import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Rechercher des utilisateurs pour suppression RGPD
export async function POST(request: NextRequest) {
  try {
    const { searchTerm } = await request.json()

    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json(
        { error: 'Terme de recherche trop court (min 2 caractères)' },
        { status: 400 }
      )
    }

    // Rechercher dans les utilisateurs et chiens
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        chiens(id, nom),
        visites:visites!inner(chien_id),
        factures(id)
      `)
      .or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .eq('role', 'client')

    if (usersError) {
      console.error('Erreur lors de la recherche:', usersError)
      return NextResponse.json(
        { error: 'Erreur lors de la recherche' },
        { status: 500 }
      )
    }

    // Rechercher par nom de chien
    const { data: chiensResults, error: chiensError } = await supabaseAdmin
      .from('chiens')
      .select(`
        *,
        proprietaire:users!proprietaire_id(*)
      `)
      .ilike('nom', `%${searchTerm}%`)

    if (chiensError) {
      console.error('Erreur lors de la recherche de chiens:', chiensError)
    }

    // Combiner les résultats
    const userIds = new Set(users.map((u: any) => u.id))
    chiensResults?.forEach((chien: any) => {
      if (chien.proprietaire && !userIds.has(chien.proprietaire.id)) {
        users.push(chien.proprietaire)
        userIds.add(chien.proprietaire.id)
      }
    })

    // Formater les résultats
    const results = await Promise.all(
      users.map(async (user: any) => {
        // Récupérer les chiens de l'utilisateur
        const { data: chiens } = await supabaseAdmin
          .from('chiens')
          .select('nom')
          .eq('proprietaire_id', user.id)

        // Récupérer les visites pour calculer la dernière visite
        const { data: visites } = await supabaseAdmin
          .from('visites')
          .select('date_debut')
          .in('chien_id', user.chiens?.map((c: any) => c.id) || [])
          .order('date_debut', { ascending: false })
          .limit(1)

        // Compter le nombre de visites
        const { count: nbVisites } = await supabaseAdmin
          .from('visites')
          .select('*', { count: 'exact', head: true })
          .in('chien_id', user.chiens?.map((c: any) => c.id) || [])

        return {
          id: user.id,
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email,
          telephone: user.telephone || '',
          chiens: chiens?.map((c: any) => c.nom) || [],
          derniereVisite: visites?.[0]?.date_debut || null,
          nombreVisites: nbVisites || 0,
        }
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
