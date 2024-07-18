import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';

import type { Category } from "~/types/Category";

export async function POST() {
    try {
        const prisma = new PrismaClient();

        let categories = (await prisma.categories.findMany()) as Category[];

        if (categories.length < 100) {
            for (let i = 0; i < 100 - categories.length; i++) {
                const fakeCategory = faker.location.country();//modify this line to add other things

                categories = await prisma.categories.findMany();

                if (categories.map(x => x.name).includes(fakeCategory)) {
                    i--;
                    continue;
                }

                await prisma.categories.create({
                    data: {
                        name: fakeCategory
                    }
                });
            }
        }

        categories = await prisma.categories.findMany();

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
            categories: [],
            message: "Internal server error!"
        }, {
            status: 500
        });
    }
}