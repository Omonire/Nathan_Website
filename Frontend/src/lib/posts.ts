import { API_BASE, adminHeaders } from './admin-auth'

export type PostSummary = {
  id: number
  slug: string
  title: string
  excerpt: string
  cover: string
  tag: string
  author: string
  status: 'draft' | 'published'
  publishedAt: string
}

export type Post = PostSummary & { body: string }

export type PostInput = {
  title: string
  excerpt: string
  body: string
  cover: string
  tag: string
  status: 'draft' | 'published'
}

export async function fetchPosts(): Promise<PostSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/posts`)
    if (!res.ok) return []
    return (await res.json()) as PostSummary[]
  } catch {
    return []
  }
}

export async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return (await res.json()) as Post
  } catch {
    return null
  }
}

export async function fetchAdminPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/posts`, { headers: adminHeaders() })
    if (!res.ok) return []
    return (await res.json()) as Post[]
  } catch {
    return []
  }
}

export async function createPost(input: PostInput): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(input),
    })
    if (!res.ok) return null
    return (await res.json()) as Post
  } catch {
    return null
  }
}

export async function updatePost(id: number, input: PostInput): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify(input),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deletePost(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}
