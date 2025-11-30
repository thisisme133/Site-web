import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, emailTemplates, FROM_EMAIL } from '@/lib/resend-client'

// Générer un code OTP à 6 chiffres
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe, sinon le créer
    let { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
      return NextResponse.json(
        { error: 'Erreur lors de la vérification de l\'utilisateur' },
        { status: 500 }
      )
    }

    // Si l'utilisateur n'existe pas, le créer comme client
    if (!user) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email,
          role: email === process.env.ADMIN_EMAIL ? 'admin' : 'client',
        })
        .select()
        .single()

      if (createError) {
        console.error('Erreur lors de la création de l\'utilisateur:', createError)
        return NextResponse.json(
          { error: 'Erreur lors de la création de l\'utilisateur' },
          { status: 500 }
        )
      }

      user = newUser
    }

    // Générer un code OTP
    const code = generateOTP()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code valide 10 minutes

    // Enregistrer le code dans la database
    const { error: otpError } = await supabaseAdmin
      .from('otp_codes')
      .insert({
        user_id: user.id,
        email,
        code,
        expires_at: expiresAt.toISOString(),
      })

    if (otpError) {
      console.error('Erreur lors de l\'enregistrement du code OTP:', otpError)
      return NextResponse.json(
        { error: 'Erreur lors de la génération du code' },
        { status: 500 }
      )
    }

    // Envoyer l'email avec le code
    const emailContent = emailTemplates.authCode(code)

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Code envoyé par email',
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
