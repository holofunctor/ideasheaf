"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/app/_components/theme-toggle";

type MenuItem = {
    name: string;
    url: string;
    external?: boolean;
};

type HeaderProps = {
    siteTitle: string;
    logoSrc?: string;
    menu: MenuItem[];
};

export default function Header({
    siteTitle,
    logoSrc,
    menu,
}: HeaderProps) {
    const pathname = usePathname();
    const normalize = (p: string) => p.replace(/\/$/, "");

    return (
        <header className="sticky top-0 z-50 bg-[var(--background)] border-neutral-200 dark:border-neutral-800">
            <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Left: Logo + toggle */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold text-lg"
                    >
                        {logoSrc && (
                            <img src={logoSrc} alt="logo" className="h-7 w-auto" />
                        )}
                        {siteTitle}
                    </Link>

                    {/* <ThemeToggle /> */}
                </div>

                {/* Right: Menu */}
                <ul className="flex items-center gap-6 text-sm font-medium">
                    {menu.map(item => {
                        const isActive =
                            normalize(pathname) === normalize(item.url);

                        return (
                            <li key={item.name} className="flex items-center">
                                <Link
                                    href={item.url}
                                    className={`flex items-center gap-1 hover:opacity-80 transition ${isActive
                                        ? "border-b-2 border-current pb-0.5"
                                        : ""
                                        }`}
                                >
                                    {item.name}

                                    {item.external && (
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                            <path d="M15 3h6v6" />
                                            <path d="M10 14L21 3" />
                                        </svg>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}
