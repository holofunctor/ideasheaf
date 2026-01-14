import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorg2rehype from 'uniorg-rehype'
import uniorgExtractKeywords from 'uniorg-extract-keywords'
import { uniorgSlug } from 'uniorg-slug'
import { visitIds } from 'orgast-util-visit-ids'

import rehypeTypst from '@myriaddreamin/rehype-typst'
import rehypeShiki from '@shikijs/rehype'

import type { Node } from 'unist'
import type { OrgNode } from 'uniorg'
import type { Plugin } from 'unified'
import type { VFile } from 'vfile'

interface PostIds {
  ids?: Record<string, string>
  [key: string]: unknown
}

// Extract org ids and map them to HTML anchors
const extractIds: Plugin = function () {
  return function transformer(tree: OrgNode, file: VFile & { data: PostIds }) {
    const data = file.data || (file.data = {})
    const ids = (data.ids ||= {})

    visitIds(tree, (id: string, node: OrgNode) => {
      if (node.type === 'org-data') {
        ids[id] = ''
      } else if (node.type === 'section') {
        const headline = node.children?.[0]

        if (!headline?.data?.hProperties?.id) {
          headline.data = headline.data || {}
          headline.data.hProperties = headline.data.hProperties || {}
          headline.data.hProperties.id = id
        }

        ids[id] = `#${headline.data.hProperties.id}`
      }
    })
  }
}

// A primitive compiler to return the node as-is without stringifying
const toJson: Plugin = function () {
  this.compiler = function (node: Node) {
    return node
  }
}

const processor = unified()
  .use(uniorgParse)
  .use(uniorgExtractKeywords)
  .use(uniorgSlug)
  .use(extractIds)
  .use(uniorg2rehype)
  .use(rehypeShiki, {
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
  })
  .use(rehypeTypst)
  .use(toJson)

// Process an Org file into HAST
export default async function orgToHtml(file: VFile & { data: PostIds }) {
  try {
    return await processor.process(file)
  } catch (err) {
    console.error('failed to process file', file.path, err)
    throw err
  }
}
