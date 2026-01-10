import fs from 'fs'
import path from 'path'
import { type Root } from 'hast'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPaths } from '@/lib/api'
import BackLink from '@/app/_components/backlink'
import Rehype from '@/app/_components/rehype'

type Props = {
  params: Promise<{ slug: string[] }>
}

interface ProseProps {
  title: string
  hast: Root
  backlinks: {
    path: string
    title: string
  }[]
}

const Prose = ({ title, hast, backlinks }: ProseProps) => {
  return (
    <main className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert mx-auto">
      <h1 className="text-3xl pb-4">{title}</h1>
      <Rehype hast={hast} />
      {backlinks.length > 0 && (
        <section className="pt-4 pb-4">
          <h2 className="text-2xl">Backlinks</h2>
          <ul>
            {backlinks.map((b) => (
              <li key={b.path}>
                <BackLink href={b.path} className="border-b">
                  {b.title}
                </BackLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

function resolvePath(slugParts: string[]): string {
  const base = path.join(process.cwd(), 'content', ...slugParts)
  if (fs.existsSync(base + '.org')) {
    return '/' + slugParts.join('/')
  } else if (fs.existsSync(path.join(base, 'index.org'))) {
    return '/' + slugParts.join('/') + '/index'
  } else {
    return '/'
  }
}

// Page component
export default async function Page(props: Props) {
  const params = await props.params
  const slugPath = resolvePath(params.slug)
  const post = slugPath ? await getPostBySlug(slugPath) : undefined

  if (!post) return notFound()

  const title: string = post.data.title || post.basename || 'Untitled'
  const hast: Root = post.result
  const backlinks: { path: string; title: string }[] = await Promise.all(
    [...(post.data.backlinks ?? new Set<string>())].map(async (b) => {
      const linkedPost = await getPostBySlug(b)
      return {
        path: linkedPost?.path ?? '#',
        title: linkedPost?.data?.title || linkedPost?.basename || 'Unknown',
      }
    })
  )

  return (
    <div className="max-w-screen-md mx-auto p-4 sm:p-16">
      <Prose title={title} hast={hast} backlinks={backlinks} />
    </div>
  )
}

// Generate metadata
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const slugPath = resolvePath(params.slug)
  const post = slugPath ? await getPostBySlug(slugPath) : undefined

  if (!post) return notFound()

  return { title: "Ideasheaf | " + (post.data.title || post.basename) }
}

// Generate static params
export async function generateStaticParams() {
  const paths = await getAllPaths()
  return paths.map((p) => ({
    slug: p.split('/').filter(Boolean),
  }))
}
