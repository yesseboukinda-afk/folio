import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-content-server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const content = await getPortfolioContent();

    return NextResponse.json({
        featureWork: content.featuredWork,
    });
};