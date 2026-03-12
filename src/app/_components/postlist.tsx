import PostEntry from "./post-entry";
import { type Post } from "@/types/post";

type PostListProps = {
    posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
    return (
        <section>
            {posts.map((post) => (
                <PostEntry key={post.slug} post={post} />
            ))}
        </section>
    );
}