import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Marquer un message comme lu
export async function POST(request: NextRequest) {
  try {
    const { messageId, conversationId } = await request.json()

    let query = supabaseAdmin
      .from('messages')
      .update({ lu: true })

    if (messageId) {
      query = query.eq('id', messageId)
    } else if (conversationId) {
      query = query.eq('conversation_id', conversationId)
    } else {
      return NextResponse.json(
        { error: 'messageId ou conversationId requis' },
        { status: 400 }
      )
    }

    const { error } = await query

    if (error) {
      console.error('Erreur lors du marquage comme lu:', error)
      return NextResponse.json(
        { error: 'Erreur lors du marquage comme lu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
