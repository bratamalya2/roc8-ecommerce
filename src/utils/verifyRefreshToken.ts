import { jwtVerify } from "jose";
import type { ProtectedHeaderParameters } from "jose";

import type { User } from "~/types/User";

interface JWTVerification {
    payload: {
        user: User,
        iat: number;
        exp: number;
    },
    protectedHeader: ProtectedHeaderParameters
}

export default async function verifyRefreshToken(refreshToken: string) {
    try {
        const secretKey = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET_KEY);

        const y: JWTVerification = await jwtVerify(refreshToken, secretKey);

        return {
            isError: false,
            user: {
                id: y.payload.user.id,
                name: y.payload.user.name,
                email: y.payload.user.email,
                password: y.payload.user.password,
                isVerified: y.payload.user.isVerified
            }
        }
    }
    catch (err) {
        console.log(err);
        return {
            isError: true,
            user: {}
        }
    }
}