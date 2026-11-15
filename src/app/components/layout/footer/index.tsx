"use client";

import { useEffect, useState } from "react";
import { getEditableFooterText } from "@/lib/portfolio-content";

const Footer = ({ footerText }: { footerText: string }) => {
    const [year, setYear] = useState("");

    useEffect(() => {
        const updateYear = () => setYear(String(new Date().getFullYear()));
        updateYear();

        const interval = window.setInterval(updateYear, 60_000);
        return () => window.clearInterval(interval);
    }, []);

    return (
        <footer className="-translate-y-[1px] bg-white border-t border-primary/10">
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="max-w-3xl mx-auto  gap-10 sm:gap-16 px-4 sm:px-7 py-4 md:py-7">
                        <p>{year} © {getEditableFooterText(footerText)}</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer