import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Supprimer les données d'un utilisateur (RGPD)
export async function POST(request: NextRequest) {
  try {
    const { userIds, adminId, raison } = await request.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs utilisateur requis' },
        { status: 400 }
      )
    }

    const deletedUsers = []

    for (const userId of userIds) {
      // Récupérer les données de l'utilisateur avant suppression
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          chiens(id, nom),
          factures(id, numero_facture),
          reservations(id, code)
        `)
        .eq('id', userId)
        .single()

      if (userError || !user) {
        console.error('Utilisateur non trouvé:', userId)
        continue
      }

      // Récupérer les IDs des chiens
      const chienIds = user.chiens?.map((c: any) => c.id) || []

      // Récupérer les visites
      const { data: visites } = await supabaseAdmin
        .from('visites')
        .select('id')
        .in('chien_id', chienIds)

      // Récupérer les messages
      const { data: messages } = await supabaseAdmin
        .from('messages')
        .select('id')
        .eq('expediteur_id', userId)

      // Créer un log d'audit
      await supabaseAdmin.from('audit_log_rgpd').insert({
        user_id: userId,
        user_email: user.email,
        user_nom: user.nom,
        user_prenom: user.prenom,
        donnees_supprimees: {
          chiens: chienIds.length,
          visites: visites?.length || 0,
          factures: user.factures?.length || 0,
          reservations: user.reservations?.length || 0,
          messages: messages?.length || 0,
        },
        supprime_par: adminId,
        raison,
      })

      // Supprimer les visites
      if (chienIds.length > 0) {
        await supabaseAdmin
          .from('visites')
          .delete()
          .in('chien_id', chienIds)
      }

      // Supprimer les chiens
      if (chienIds.length > 0) {
        await supabaseAdmin
          .from('chiens')
          .delete()
          .in('id', chienIds)
      }

      // Supprimer les factures
      await supabaseAdmin
        .from('factures')
        .delete()
        .eq('client_id', userId)

      // Supprimer les réservations (les messages seront supprimés en cascade)
      await supabaseAdmin
        .from('reservations')
        .delete()
        .eq('client_id', userId)

      // Supprimer les messages orphelins
      await supabaseAdmin
        .from('messages')
        .delete()
        .eq('expediteur_id', userId)

      // Supprimer l'utilisateur
      await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId)

      deletedUsers.push({
        id: userId,
        email: user.email,
        nom: `${user.prenom || ''} ${user.nom || ''}`,
      })
    }

    return NextResponse.json({
      success: true,
      deleted: deletedUsers.length,
      users: deletedUsers,
    })
  } catch (error) {
    console.error('Erreur lors de la suppression RGPD:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
