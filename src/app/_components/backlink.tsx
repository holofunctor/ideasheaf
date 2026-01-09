import Link, { LinkProps } from 'next/link'
import { PropsWithChildren } from 'react'

type BackLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string
  }
>

export default function BackLink({ href, children, ...rest }: BackLinkProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
