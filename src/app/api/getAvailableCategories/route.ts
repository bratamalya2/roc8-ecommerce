import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import type { Category } from "~/types/Category";

export async function GET(request: Request) {
    try {
        const prisma = new PrismaClient();

        const categories: Category[] = await prisma.categories.findMany();

        return NextResponse.json({
            isError: false,
            categories
        }, {
            status: 200
        });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({
            isError: true,
            message: "Internal server error!"
        }, {
            status: 500
        });
    }
}