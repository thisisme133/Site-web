import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { startOfYear, startOfMonth, subMonths, format } from 'date-fns'

// GET - Récupérer les statistiques pour le dashboard
export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const debutAnnee = startOfYear(now)

    // Récupérer toutes les visites de l'année
    const { data: visites, error: visitesError } = await supabaseAdmin
      .from('visites')
      .select('*')
      .gte('date_debut', debutAnnee.toISOString())
      .order('date_debut', { ascending: true })

    if (visitesError) {
      console.error('Erreur visites:', visitesError)
      return NextResponse.json({ error: 'Erreur' }, { status: 500 })
    }

    // Récupérer le nombre total de chiens actifs
    const { count: totalChiens, error: chiensError } = await supabaseAdmin
      .from('chiens')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'actif')

    if (chiensError) {
      console.error('Erreur chiens:', chiensError)
    }

    // Calculer les statistiques globales
    const totalGardes = visites?.filter((v) => v.type === 'garde').length || 0
    const totalActes = visites?.filter((v) => v.type !== 'garde').length || 0
    const caAnnuel = visites?.reduce((sum, v) => sum + (v.montant || 0), 0) || 0

    // Statistiques par mois pour les charts
    const moisActuel = now.getMonth()
    const statsParMois = Array.from({ length: 12 }, (_, i) => ({
      mois: i,
      nom: format(new Date(now.getFullYear(), i, 1), 'MMM'),
      gardes: 0,
      actes: 0,
    }))

    visites?.forEach((visite) => {
      const mois = new Date(visite.date_debut).getMonth()
      if (visite.type === 'garde') {
        statsParMois[mois].gardes++
      } else {
        statsParMois[mois].actes++
      }
    })

    // Statistiques par semaine pour le mois actuel
    const debutMois = startOfMonth(now)
    const visitesParSemaine = [0, 0, 0, 0]

    visites
      ?.filter((v) => new Date(v.date_debut) >= debutMois && v.type === 'garde')
      .forEach((visite) => {
        const jour = new Date(visite.date_debut).getDate()
        const semaine = Math.floor((jour - 1) / 7)
        if (semaine < 4) {
          visitesParSemaine[semaine]++
        }
      })

    // Statistiques par trimestre
    const trimestre1 = visites?.filter((v) => {
      const mois = new Date(v.date_debut).getMonth()
      return mois >= 0 && mois <= 2 && v.type === 'garde'
    }).length || 0

    const trimestre2 = visites?.filter((v) => {
      const mois = new Date(v.date_debut).getMonth()
      return mois >= 3 && mois <= 5 && v.type === 'garde'
    }).length || 0

    const trimestre3 = visites?.filter((v) => {
      const mois = new Date(v.date_debut).getMonth()
      return mois >= 6 && mois <= 8 && v.type === 'garde'
    }).length || 0

    // Statistiques par semestre
    const semestre1 = visites?.filter((v) => {
      const mois = new Date(v.date_debut).getMonth()
      return mois >= 0 && mois <= 5 && v.type === 'garde'
    }).length || 0

    const semestre2 = visites?.filter((v) => {
      const mois = new Date(v.date_debut).getMonth()
      return mois >= 6 && mois <= 11 && v.type === 'garde'
    }).length || 0

    // Chiens les plus fréquents
    const { data: chiensFrequents, error: frequentsError } = await supabaseAdmin
      .from('chiens')
      .select(`
        id,
        nom,
        race,
        visites(id)
      `)
      .eq('statut', 'actif')
      .order('nom', { ascending: true })

    if (frequentsError) {
      console.error('Erreur chiens fréquents:', frequentsError)
    }

    const chiensAvecVisites = chiensFrequents
      ?.map((chien: any) => ({
        nom: chien.nom,
        race: chien.race,
        visites: chien.visites?.length || 0,
      }))
      .filter((c) => c.visites > 0)
      .sort((a, b) => b.visites - a.visites)
      .slice(0, 5) || []

    return NextResponse.json({
      statsGlobales: {
        totalGardes,
        totalActes,
        totalChiens: totalChiens || 0,
        caAnnuel,
      },
      gardesData: {
        mensuel: {
          labels: ['S1', 'S2', 'S3', 'S4'],
          values: visitesParSemaine,
        },
        trimestre: {
          labels: ['Trim. 1', 'Trim. 2', 'Trim. 3'],
          values: [trimestre1, trimestre2, trimestre3],
        },
        semestre: {
          labels: ['Sem. 1', 'Sem. 2'],
          values: [semestre1, semestre2],
        },
        annuel: {
          labels: statsParMois.map((m) => m.nom),
          values: statsParMois.map((m) => m.gardes),
        },
      },
      chiensFrequents: chiensAvecVisites,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
