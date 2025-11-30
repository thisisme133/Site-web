import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Upload une pièce jointe
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier manquant' },
        { status: 400 }
      )
    }

    // Convertir le fichier en buffer
    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)

    // Générer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name}`

    // Upload vers Supabase Storage
    const { data, error } = await supabaseAdmin
      .storage
      .from('messages')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
      })

    if (error) {
      console.error('Erreur lors de l\'upload:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      )
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabaseAdmin
      .storage
      .from('messages')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      nom: file.name,
      taille: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
