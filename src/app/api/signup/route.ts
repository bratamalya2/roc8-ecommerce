import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

import sendMail from "./sendMail";

const UserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().length(8)
});

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        const user = {
            name,
            email,
            password
        };

        if (!UserSchema.safeParse(user).success)
            return NextResponse.json({
                isError: true,
                message: "Wrong inputs!"
            }, {
                status: 400
            });

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const prisma = new PrismaClient();

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (existingUser !== null)
            return NextResponse.json({
                isError: true,
                message: "Email already exists!"
            }, {
                status: 400
            });

        const createdUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hash
            }
        });

        const { isError, otp } = await sendMail(email);

        if (isError)
            return NextResponse.json({
                isError: true
            }, {
                status: 500
            })

        let date = new Date();
        date.setDate(date.getDate() + 1);

        await prisma.verification.create({
            data: {
                userId: createdUser.id,
                otp,
                expiry: date.toISOString()
            }
        })

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