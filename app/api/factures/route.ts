import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateFacturePdfBuffer } from '@/lib/facture-pdf'

// GET - Récupérer les factures
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const statut = searchParams.get('statut')
    const numeroFacture = searchParams.get('numero')
    const search = searchParams.get('q')

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

    if (search) {
      query = query.or(
        `client_nom.ilike.%${search}%,client_email.ilike.%${search}%,numero_facture.ilike.%${search}%,notes.ilike.%${search}%,lignes::text.ilike.%${search}%`
      )
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

    const lignes = (body.lignes || body.lignes_facture || []).map((l: any) => ({
      description: l.description,
      quantite: Number(l.quantite) || 0,
      prix_unitaire: Number(l.prix_unitaire ?? l.prixUnitaire) || 0,
    }))

    const montant_total = lignes.reduce(
      (acc: number, l: any) => acc + (l.quantite * l.prix_unitaire || 0),
      0
    )

    const payload = {
      type: body.type,
      numero_facture: body.numero_facture ?? body.numeroFacture,
      client_id: body.client_id ?? body.clientId ?? null,
      client_nom: body.client_nom ?? body.clientNom,
      client_adresse: body.client_adresse ?? body.clientAdresse ?? null,
      client_email: body.client_email ?? body.clientEmail ?? null,
      client_siret: body.client_siret ?? body.clientSiret ?? null,
      date_emission: body.date_emission ?? body.dateEmission,
      date_echeance:
        body.date_echeance ?? body.dateEcheance ?? body.date_emission ?? body.dateEmission,
      lignes,
      montant_total,
      statut: body.statut ?? 'a_regler',
      moyen_paiement: body.moyen_paiement ?? body.moyenPaiement ?? null,
      notes: body.notes ?? null,
    }

    // Générer un numéro de facture automatique si non fourni
    if (!payload.numero_facture) {
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

      payload.numero_facture = `${prefix}${annee}-${nextNumber.toString().padStart(4, '0')}`
    }

    const { data, error } = await supabaseAdmin
      .from('factures')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la facture:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la facture' },
        { status: 500 }
      )
    }

    let pdfUrl = data?.pdf_url as string | null

    if (data) {
      const pdfBuffer = generateFacturePdfBuffer({
        numero_facture: data.numero_facture,
        client_nom: data.client_nom,
        client_adresse: data.client_adresse,
        client_email: data.client_email,
        client_siret: data.client_siret,
        date_emission: data.date_emission,
        date_echeance: data.date_echeance,
        lignes: data.lignes,
        montant_total: data.montant_total,
        type: data.type,
        statut: data.statut,
        moyen_paiement: data.moyen_paiement,
        notes: data.notes,
      })

      const { error: uploadError } = await supabaseAdmin.storage
        .from('factures')
        .upload(`${data.numero_facture}.pdf`, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (!uploadError) {
        const publicUrl = supabaseAdmin.storage
          .from('factures')
          .getPublicUrl(`${data.numero_facture}.pdf`)

        pdfUrl = publicUrl.data.publicUrl

        await supabaseAdmin
          .from('factures')
          .update({ pdf_url: pdfUrl })
          .eq('id', data.id)
      } else {
        console.error('Erreur lors du chargement du PDF:', uploadError)
      }
    }

    return NextResponse.json({ ...data, pdf_url: pdfUrl }, { status: 201 })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
