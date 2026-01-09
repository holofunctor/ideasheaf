import path from 'path'
import { trough } from 'trough'
import { read } from 'to-vfile'
import { findDownAll } from 'vfile-find-down'

import type { Post } from '@/types/post'

import orgToHtml from './orgToHtml'
import resolveLinks from './resolveLinks'

const pagesDirectory: string = path.join(process.cwd(), 'content')

const processor = trough()
  .use(collectFiles)
  .use(processPosts)
  .use(resolveLinks)
  .use(populateBacklinks)

// Collect all `.org` files and assign slugs
async function collectFiles(root: string): Promise<Post[]> {
  const files = (await findDownAll('.org', root)) as Post[]

  files.forEach((file) => {
    const slug =
      '/' + path.relative(root, file.path as string).replace(/\.org$/, '')
    file.data = file.data || {}
    file.slug = slug
  })

  return files
}

// Read files and convert Org -> HTML
async function processPosts(files: Post[]): Promise<Post[]> {
  return Promise.all(files.map(processPost))

  async function processPost(file: Post): Promise<Post> {
    try {
      await read(file, 'utf8')
    } catch (err) {
      console.error('Error reading file', file, err)
      throw err
    }

    file.path = file.slug

    await orgToHtml(file)

    return file
  }
}

// Populate backlinks after all pages are processed
function populateBacklinks(files: Post[]): void {
  const backlinks: Record<string, Set<string>> = {}

  files.forEach((file) => {
    file.data.links = file.data.links || new Set<string>()
    file.data.backlinks = backlinks[file.slug] ||= new Set<string>()

    file.data.links.forEach((other) => {
      const decodedOther = decodeURIComponent(other)
      backlinks[decodedOther] ||= new Set<string>()
      backlinks[decodedOther].add(file.slug)
    })
  })
}

// Load all posts
const loadPosts = async (): Promise<Record<string, Post>> => {
  const files = (await new Promise<Post[]>((resolve, reject) =>
    processor.run(pagesDirectory, (err: Error, result: Post[]) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      const files: Post[] = Array.isArray(result)
        ? result
        : result
          ? [result as Post]
          : []
      resolve(files)
    })
  )) as Post[]

  return Object.fromEntries(
    files.filter((f) => f.slug).map((f) => [f.slug, f] as const)
  )
}

const allPosts = async (): Promise<Record<string, Post>> => {
  return loadPosts()
}

// Public API
export async function getAllPaths(): Promise<string[]> {
  const posts = await loadPosts()
  return Object.keys(posts)
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await allPosts()
  return posts[slug]
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await allPosts()
  return Object.values(posts)
}
