import Link from "next/link";
import { type Post } from "@/types/post";

type PostEntryProps = {
    post: Post;
};

export default function PostEntry({ post }: PostEntryProps) {
    return (
        <article className="
            relative mb-[var(--gap)] p-[var(--gap)]
            rounded-[var(--radius)]
            border border-transparent
            bg-transparent
            transition-colors duration-150
            hover:bg-[var(--entry)]
            hover:border-[var(--border)]
            active:scale-[0.96]
        ">
            {/* Post link */}
            <Link href={`${post.slug}`} className="block">
                <h2 className="text-xl font-semibold">
                    {post.data.title}
                </h2>
            </Link>

            <p className="text-neutral-500 mt-1">
                {post.data.excerpt}
            </p>

            <footer className="relative mt-2 text-sm text-[#777]">
                {/* Tags */}
                {post.data.tags?.trim().split(/\s+/).map((tag) => (
                    <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="mr-2 before:content-['#'] hover:text-[#000]"
                    >
                        {tag}
                    </Link>
                ))}

                {/* Date */}
                <span className="absolute right-0 uppercase">
                    {post.data.date}
                </span>
            </footer>
        </article>
    );
}