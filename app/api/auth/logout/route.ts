import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Pour un système OTP simple, la déconnexion se fait côté client
    // en supprimant le token/session du localStorage
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
