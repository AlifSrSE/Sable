import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'CLERK_WEBHOOK_SECRET not set' },
      { status: 500 }
    )
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id        = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  // Verify webhook signature
  const payload = await req.json()
  const body    = JSON.stringify(payload)
  const wh      = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id':        svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle events
  const { type, data } = evt

  if (type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = data

    const email = email_addresses[0]?.email_address
    if (!email) {
      return NextResponse.json({ error: 'No email' }, { status: 400 })
    }

    const name = [first_name, last_name].filter(Boolean).join(' ') || null

    try {
      await prisma.user.create({
        data: {
          id,           // Use Clerk's user ID as our UUID
          email,
          name,
          avatarUrl: image_url ?? null,
        },
      })
      console.log(`✓ User created: ${email}`)
    } catch (err: any) {
      // If user already exists, ignore
      if (err?.code === 'P2002') {
        console.log(`User already exists: ${email}`)
      } else {
        console.error('Error creating user:', err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }
  }

  if (type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = data

    const email = email_addresses[0]?.email_address
    const name  = [first_name, last_name].filter(Boolean).join(' ') || null

    try {
      await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(name  && { name }),
          avatarUrl: image_url ?? null,
        },
      })
      console.log(`✓ User updated: ${id}`)
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  return NextResponse.json({ received: true })
}