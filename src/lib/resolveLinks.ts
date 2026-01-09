import { unified } from 'unified'
import inspectUrls from 'rehype-url-inspector'

import type { Element } from 'hast'
import type { Node } from 'unist'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

import type { Post } from '@/types/post'

interface IdRef {
  path: string
  anchor: string
}

// Convert file.result -> AST
const fromJson: Plugin = function () {
  this.parser = function (node: string, file: VFile): Node {
    return (file.result as Node) ?? JSON.parse(node)
  }
}

// Return AST as-is without stringification
const toJson: Plugin = function () {
  this.compiler = function (node: Node) {
    return node
  }
}

export default function resolveLinks(files: Post[]): Promise<Post[]> {
  // map from id -> { path, anchor }
  const idMap: Record<string, IdRef> = {}

  files.forEach((file) => {
    const ids = file.data.ids ?? {}
    Object.entries(ids).forEach(([id, anchor]) => {
      idMap[id] = { path: file.path, anchor }
    })
  })

  const processor = unified()
    .use(fromJson)
    .use(inspectUrls, { inspectEach: processUrl })
    .use(toJson)

  return Promise.all(
    files.map((file) => processor.process(file) as Promise<Post>)
  )

  /**
   * Process each link to:
   * 1. Resolve id links
   * 2. Convert file:// links into site paths
   * 3. Collect outgoing links for backlink generation
   */
  function processUrl({
    url: urlString,
    propertyName,
    node,
    file,
  }: {
    url: string
    propertyName: string
    node: Element
    file: Post
  }) {
    try {
      // Normalize against file path (slug)
      let url = new URL(urlString, 'file://' + file.path)

      // Process id links
      if (url.protocol === 'id:') {
        const id = url.pathname
        const ref = idMap[id]
        if (ref) {
          url = new URL(`file://${ref.path}${ref.anchor}`)
        } else {
          console.warn(`${file.path}: Unresolved id link`, urlString)
        }
        // fallthrough: id links become file links
      }

      if (url.protocol === 'file:') {
        const href = url.pathname.replace(/\.org$/, '')
        node.properties[propertyName] = href + url.hash

        file.data.links ||= new Set<string>()
        file.data.links.add(href)
      }
    } catch (err) {
      console.warn(`${file.path}: Failed to process URL`, urlString, err)
    }
  }
}
