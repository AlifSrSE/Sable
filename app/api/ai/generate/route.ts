import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenRouter is fully OpenAI-compatible — just swap base URL + key
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:  process.env.OPENROUTER_API_KEY ?? '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://sable.app',
    'X-Title':      'Sable',
  },
})

// Primary model: NVIDIA Nemotron Ultra (free) — verify exact ID at openrouter.ai/models
// Fallback:      google/gemini-2.0-flash-exp:free
const PRIMARY_MODEL  = 'nvidia/nemotron-3-ultra-550b-a55b:free'
const FALLBACK_MODEL = 'google/gemini-2.0-flash-exp:free'

function buildPrompt(topic: string, platforms: string[]): string {
  const platformNames = platforms.join(', ')
  const limits: Record<string, number> = { twitter: 280, instagram: 2200, linkedin: 3000 }
  const tightest = Math.min(...platforms.map(p => limits[p] ?? 3000))

  return `You are a professional social media strategist. Write an engaging post for ${platformNames} about the following topic.

Topic: ${topic}

Guidelines:
- Stay under ${tightest} characters (the tightest limit across selected platforms)
- Write in a confident, insightful, first-person voice — like a founder or expert sharing hard-won knowledge
- Lead with the hook: an unexpected angle, counterintuitive truth, or bold statement
- Include 2–4 relevant hashtags at the end
- Do NOT include any XML, markdown fences, or meta-commentary — output the post text only
- Optimise for genuine engagement, not virality bait

Write the post now:`
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { topic, platforms = ['linkedin'] } = body

  if (!topic?.trim()) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY is not set' }, { status: 500 })
  }

  const prompt = buildPrompt(topic.trim(), platforms)

  // Try primary model, fall back on error
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const completion = await openrouter.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.8,
      })
      const text = completion.choices[0]?.message?.content?.trim() ?? ''
      if (!text) throw new Error('Empty response')
      return NextResponse.json({ content: text, model })
    } catch (err) {
      if (model === FALLBACK_MODEL) {
        console.error('[ai/generate] Both models failed:', err)
        return NextResponse.json({ error: 'AI generation failed — check OPENROUTER_API_KEY and model availability' }, { status: 502 })
      }
      // Try fallback
      console.warn(`[ai/generate] Primary model (${model}) failed, trying fallback...`, err)
    }
  }
}
