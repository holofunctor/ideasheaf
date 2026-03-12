export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-16">
            <div className="py-6 text-sm text-neutral-500 text-center">
                © {new Date().getFullYear()}
                <span className="ml-2 hover:text-[#000] hover:underline">Holofunctor</span>
                <span className="mx-2">·</span>
                Powered by
                <a className="hover:text-[#000] hover:underline mx-1">Next.js</a>
                &
                <a className="hover:text-[#000] hover:underline mx-1">Uniorg</a>
            </div>
        </footer>
    );
}
