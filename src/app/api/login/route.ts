import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json() as { email: string; password: string; };
        const user = {
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

        const prisma = new PrismaClient();

        const existingUser = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!existingUser)
            return NextResponse.json({
                isError: true,
                message: "User not found!"
            }, {
                status: 404
            });

        const isPasswordMatching = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordMatching)
            return NextResponse.json({
                isError: true,
                message: "Email and password don't match!"
            }, {
                status: 401
            });
        else {
            if (!existingUser.isVerified)
                return NextResponse.json({
                    isError: true,
                    message: "User not verified!"
                }, {
                    status: 403
                });
            const securedData = {
                user: existingUser
            };

            const accessTokenSecretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY);
            let accessToken: string | null = null;
            accessToken = await new SignJWT(securedData)
                .setProtectedHeader({ alg: "HS256", typ: "JWT" })
                .setIssuedAt()
                .setExpirationTime("10m") // Token expires in 10 minutes
                .sign(accessTokenSecretKey);

            const refreshTokenSecretKey = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET_KEY);
            let refreshToken: string | null = null;
            refreshToken = await new SignJWT(securedData)
                .setProtectedHeader({ alg: "HS256", typ: "JWT" })
                .setIssuedAt()
                .setExpirationTime("2h") // Token expires in 2 hours
                .sign(refreshTokenSecretKey);

            return NextResponse.json({
                isError: false,
                accessToken,
                refreshToken
            }, {
                status: 200
            });
        }
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