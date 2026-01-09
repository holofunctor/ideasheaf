import Page from '@/app/[...slug]/page'

export default async function Home() {
  return <Page params={Promise.resolve({ slug: ['wiki', 'index'] })} />
}
