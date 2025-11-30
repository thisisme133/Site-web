import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, emailTemplates, FROM_EMAIL, isResendConfigured } from '@/lib/resend-client'

// POST - Envoyer une facture par email
export async function POST(request: NextRequest) {
  try {
    const { factureId } = await request.json()

    if (!isResendConfigured) {
      return NextResponse.json(
        {
          error:
            "L'envoi d'email est désactivé. Ajoutez RESEND_API_KEY (et idéalement RESEND_FROM_EMAIL) dans votre .env.local.",
        },
        { status: 500 }
      )
    }

    if (!factureId) {
      return NextResponse.json(
        { error: 'ID de facture requis' },
        { status: 400 }
      )
    }

    // Récupérer la facture
    const { data: facture, error } = await supabaseAdmin
      .from('factures')
      .select('*')
      .eq('id', factureId)
      .single()

    if (error || !facture) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      )
    }

    if (!facture.client_email) {
      return NextResponse.json(
        { error: 'Aucun email client configuré' },
        { status: 400 }
      )
    }

    // Préparer le contenu de l'email
    const emailContent = emailTemplates.invoice({
      clientNom: facture.client_nom,
      numeroFacture: facture.numero_facture,
      montant: facture.montant_total,
      pdfUrl: facture.pdf_url,
    })

    // Envoyer l'email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: facture.client_email,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    return NextResponse.json({
      success: true,
      message: 'Facture envoyée par email',
    })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la facture:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la facture' },
      { status: 500 }
    )
  }
}
