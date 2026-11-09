import fs from 'fs'
import path from 'path'

// Looks for public/projects/<slug>.{png,webp,jpg,jpeg}; returns its URL or null.
export function getCover(slug: string): string | null {
  const dir = path.join(process.cwd(), 'public', 'projects')
  for (const ext of ['png', 'webp', 'jpg', 'jpeg']) {
    if (fs.existsSync(path.join(dir, `${slug}.${ext}`))) return `/projects/${slug}.${ext}`
  }
  return null
}

// true if a /public path like "/projects/mars-rover/x.jpg" exists on disk
export function publicFileExists(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), 'public', src))
}
