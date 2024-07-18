import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const UserSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(8)
});

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();
        const user = { email, otp };

        if (!UserSchema.safeParse(user).success)
            return NextResponse.json({
                isError: true,
                message: "Incorrect details!"
            }, {
                status: 400
            });

        const prisma = new PrismaClient();

        const currentUser = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!currentUser)
            return NextResponse.json({
                isError: true,
                message: "Incorrect email!"
            }, {
                status: 400
            });

        const currentVerification = await prisma.verification.findFirst({
            where: {
                userId: currentUser?.id
            }
        });

        if (!currentVerification)
            return NextResponse.json({
                isError: true,
                message: "User hasn't signed up!"
            }, {
                status: 400
            });

        if (currentVerification.otp === otp)
            await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    isVerified: true
                }
            });
        else
            return NextResponse.json({
                isError: true,
                message: "Wrong OTP entered!"
            }, {
                status: 403
            });

        return NextResponse.json({
            isError: false,
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