import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer les factures
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const statut = searchParams.get('statut')
    const numeroFacture = searchParams.get('numero')

    let query = supabaseAdmin
      .from('factures')
      .select('*')
      .order('date_emission', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (statut) {
      query = query.eq('statut', statut)
    }

    if (numeroFacture) {
      query = query.eq('numero_facture', numeroFacture)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur lors de la récupération des factures:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des factures' },
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

// POST - Créer une nouvelle facture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Générer un numéro de facture automatique si non fourni
    if (!body.numero_facture) {
      const annee = new Date().getFullYear()
      const prefix = body.type === 'garde' ? 'G' : 'C'

      // Récupérer le dernier numéro de facture de l'année
      const { data: lastFacture } = await supabaseAdmin
        .from('factures')
        .select('numero_facture')
        .like('numero_facture', `${prefix}${annee}-%`)
        .order('numero_facture', { ascending: false })
        .limit(1)
        .single()

      let nextNumber = 1
      if (lastFacture) {
        const match = lastFacture.numero_facture.match(/-(\d+)$/)
        if (match) {
          nextNumber = parseInt(match[1]) + 1
        }
      }

      body.numero_facture = `${prefix}${annee}-${nextNumber.toString().padStart(4, '0')}`
    }

    const { data, error } = await supabaseAdmin
      .from('factures')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la facture:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la facture' },
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
