import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function DELETE() {
    try {
        const prisma = new PrismaClient();

        const verifications = await prisma.verification.findMany();

        const idsToBeRemoved: number[] = [];

        verifications.forEach((v: { userId: number; otp: string; expiry: Date }) => {
            if (v.expiry < new Date())
                idsToBeRemoved.push(v.userId);
        });

        await prisma.verification.deleteMany({
            where: {
                userId: {
                    in: idsToBeRemoved
                }
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