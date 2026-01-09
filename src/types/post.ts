import type { VFile } from 'vfile'
import type { Root } from 'hast'

export type Post = VFile & {
  slug: string
  result: Root
  basename: string
  path: string
  data: {
    title: string
    author: string
    date: string
    excerpt: string
    content: string
    toc?: boolean
    preview?: boolean
    ids?: Record<string, string>
    links?: Set<string>
    backlinks?: Set<string>
    [key: string]: unknown
  }
}
