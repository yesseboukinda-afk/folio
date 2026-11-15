import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
    DEFAULT_PORTFOLIO_CONTENT,
    isPortfolioContent,
} from "@/lib/portfolio-content";

export async function getPortfolioContent() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        return DEFAULT_PORTFOLIO_CONTENT;
    }

    const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
        .from("portfolio_content")
        .select("content")
        .eq("id", "main")
        .maybeSingle();

    if (error) {
        throw new Error(`Impossible de charger le contenu du portfolio : ${error.message}`);
    }

    if (!data) {
        return DEFAULT_PORTFOLIO_CONTENT;
    }

    if (!isPortfolioContent(data.content)) {
        throw new Error("Le contenu enregistré dans Supabase n'a pas le format attendu.");
    }

    return data.content;
}
