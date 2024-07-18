import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import type { Category } from "~/types/Category";

const CategorySchema = z.array(
    z.object({
        id: z.number(),
        name: z.string()
    })
);

export async function POST(request: Request) {
    try {
        const headersList = headers();
        const { id: userId, email } = JSON.parse(headersList.get("user") as string);
        const categories: Category[] = await request.json();

        if (!CategorySchema.safeParse(categories).success)
            return NextResponse.json({
                isError: true,
                message: "Wrong inputs!"
            }, {
                status: 400
            });

        const prisma = new PrismaClient();

        categories.map(async (category: Category) => {
            try {
                await prisma.categoriesOfUser.create({
                    data: {
                        userId,
                        categoryId: category.id
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });

        return NextResponse.json({
            isError: false
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