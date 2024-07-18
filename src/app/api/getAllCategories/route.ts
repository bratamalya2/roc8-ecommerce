import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

import type { CategoriesOfUser } from "~/types/CategoriesOfUser";
import type { Category } from "~/types/Category";

export async function GET(request: Request) {
    try {
        const headersList = headers();
        const { id: userId, email } = JSON.parse(headersList.get("user") as string);

        const prisma = new PrismaClient();

        const categories: CategoriesOfUser[] = await prisma.categoriesOfUser.findMany({
            where: {
                userId
            }
        });

        const selectedCategoryIds = categories.map(cat => cat.categoryId);

        const selectedCategoriesDetails: Category[] = await prisma.categories.findMany({
            where: {
                id: {
                    in: selectedCategoryIds
                }
            }
        });

        return NextResponse.json({
            isError: false,
            selectedCategories: selectedCategoriesDetails
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