import { site } from '../data/site-content'

type PuterChat = (messages: unknown, options?: Record<string, unknown>) => Promise<unknown>

declare global {
  interface Window {
    puter?: { ai: { chat: PuterChat } }
  }
}

const PUTER_SRC = 'https://js.puter.com/v2/'
let loader: Promise<void> | null = null

function loadPuter(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Puter is browser-only.'))
  if (window.puter?.ai) return Promise.resolve()
  if (loader) return loader

  loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PUTER_SRC
    script.async = true
    script.onload = () => {
      if (window.puter?.ai) resolve()
      else reject(new Error('Puter loaded without the AI API.'))
    }
    script.onerror = () => {
      loader = null
      reject(new Error('Could not load Puter. Check your connection and try again.'))
    }
    document.head.appendChild(script)
  })

  return loader
}

function readText(result: unknown): string {
  if (typeof result === 'string') return result
  if (!result || typeof result !== 'object') return ''

  const data = result as { message?: { content?: unknown }; text?: unknown }
  if (typeof data.text === 'string') return data.text

  const content = data.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part || typeof part !== 'object') return ''
        const text = (part as { text?: unknown }).text
        return typeof text === 'string' ? text : ''
      })
      .join('')
  }

  return ''
}

async function chat(messages: unknown, options: Record<string, unknown>): Promise<string> {
  await loadPuter()
  const puter = window.puter
  if (!puter) throw new Error('Puter is unavailable.')

  const result = await puter.ai.chat(messages, { normalize: true, ...options })
  const text = readText(result).trim()
  if (!text) throw new Error('The AI returned an empty response. Try again.')
  return text
}

function parseJson<T>(text: string): T | null {
  const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T
  } catch {
    return null
  }
}

function cleanBody(body: string): string {
  return body
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/`/g, '')
    .trim()
}

function siteBrief(): string {
  const services = site.services.map((s) => `${s.name} (${s.duration})`).join('; ')
  const projects = site.projects.map((p) => `${p.name} — ${p.specialty}`).join('; ')
  return [
    `Editor: ${site.brand.name}, ${site.brand.studio} based in ${site.contact.city}.`,
    `Tagline: ${site.brand.tagline}`,
    `Audience: YouTube creators, podcasters and brands who care about retention.`,
    `Services: ${services}.`,
    `Tools: ${site.about.tools.join(', ')}.`,
    `Selected work: ${projects}.`,
    `Contact email: ${site.contact.email}.`,
  ].join(' ')
}

export type BlogDraft = {
  title: string
  excerpt: string
  body: string
  tag: string
}

export async function suggestBlogTopics(existingTitles: string[]): Promise<string[]> {
  const avoid = existingTitles.length
    ? `Do not repeat or closely paraphrase these existing titles: ${existingTitles.join(' | ')}.`
    : ''

  const text = await chat(
    [
      {
        role: 'system',
        content:
          'You suggest blog topics for a video editor\'s portfolio. Topics must be specific, practical and written for YouTube creators. Return only valid JSON.',
      },
      {
        role: 'user',
        content: [
          siteBrief(),
          'Suggest 6 blog topics that would attract creators looking for an editor.',
          'Each topic should promise a concrete lesson about editing, retention, color, sound, motion or workflow.',
          'Avoid generic titles like "The importance of video editing".',
          avoid,
          'Return JSON in exactly this shape: {"topics":["topic 1","topic 2"]}',
        ].join('\n'),
      },
    ],
    { max_tokens: 500, temperature: 0.9 },
  )

  const data = parseJson<{ topics?: unknown }>(text)
  const topics = Array.isArray(data?.topics)
    ? data.topics.filter((t): t is string => typeof t === 'string' && Boolean(t.trim())).slice(0, 6)
    : []

  if (!topics.length) throw new Error('The AI did not return any topics. Try again.')
  return topics
}

export async function generateBlogDraft(topic: string): Promise<BlogDraft> {
  const text = await chat(
    [
      {
        role: 'system',
        content: [
          'You write blog posts for a retention-first video editor.',
          'Voice: direct, practical and calm. No hype, no fluff, no corporate filler.',
          'Write in first person as the editor.',
          'Only use facts from the brief. Never invent client names, view counts, testimonials or results.',
          'Never promise guaranteed views, virality or income.',
        ].join(' '),
      },
      {
        role: 'user',
        content: [
          siteBrief(),
          `Write a blog post about: ${topic}`,
          'Requirements:',
          '- 700 to 1000 words.',
          '- Title under 70 characters.',
          '- Excerpt under 160 characters.',
          '- Body is plain text: short paragraphs separated by blank lines.',
          '- No markdown, no headings, no bullet symbols, no emojis.',
          '- Open with a specific problem the viewer has, then give actionable advice.',
          '- End with a short takeaway. Do not add a call to action; the site adds one.',
          `- Tag must be one of: Editing, Retention, Color, Sound, Motion, Shorts, Workflow, Client Work.`,
          'Return JSON in exactly this shape: {"title":"","excerpt":"","body":"","tag":""}',
        ].join('\n'),
      },
    ],
    { max_tokens: 2400, temperature: 0.7 },
  )

  const data = parseJson<Partial<BlogDraft>>(text)
  if (!data || typeof data.title !== 'string' || typeof data.body !== 'string') {
    throw new Error('The AI response could not be read. Try again.')
  }

  const draft: BlogDraft = {
    title: data.title.trim(),
    excerpt: typeof data.excerpt === 'string' ? data.excerpt.trim() : '',
    body: cleanBody(data.body),
    tag: typeof data.tag === 'string' ? data.tag.trim() : '',
  }

  if (!draft.title || !draft.body) throw new Error('The AI returned an incomplete draft. Try again.')
  return draft
}
