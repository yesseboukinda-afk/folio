"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./header";

export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return children;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}
