// import Page from '@/app/[...slug]/page'

// export default async function Home() {
//   return <Page params={Promise.resolve({ slug: ['wiki', 'index'] })} />
// }

import { getAllPosts } from "@/lib/api";
import Header from "@/app/_components/header";
import Intro from "./_components/intro";
import Footer from "@/app/_components/footer";
import PostList from "./_components/postlist";

const menu = [
  { name: "Archives", url: "/archives" },
  { name: "Tags", url: "/tags" },
  {
    name: "GitHub",
    url: "https://github.com/holofunctor",
    external: true,
  },
];

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Header
        siteTitle="Ideasheaf"
        //logoSrc="/logo.png"   // optional
        menu={menu}
      />

      <Intro />

      {/* <h1 className="text-3xl font-bold mb-6">My Blog</h1> */}

      <PostList posts={posts} />
      <Footer />

    </main>
  );
}

