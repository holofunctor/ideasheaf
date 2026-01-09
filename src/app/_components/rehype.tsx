import { unified } from 'unified'
import rehypeReact from 'rehype-react'
import type { Root } from 'hast'
import * as prod from 'react/jsx-runtime'

import BackLink from './backlink'

const processor = unified().use(rehypeReact, {
  jsx: prod.jsx,
  jsxs: prod.jsxs,
  Fragment: prod.Fragment,
  components: {
    a: BackLink,
  },
})

export default function Rehype({ hast }: { hast: Root }) {
  return <>{processor.stringify(hast)}</>
}
