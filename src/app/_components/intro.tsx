export default function Intro() {
    return (
        <section className="relative mt-[var(--gap)] mb-[var(--gap)] p-[var(--gap)] bg-[var(--background)]">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Hi, I’m Holofunctor
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl">
                Welcome to my personal wiki.
                I write about mathematics, computer science and things I find interesting.
            </p>

            <div className="flex gap-3 flex-wrap">
                {/* buttons */}
            </div>
        </section>
    );
}