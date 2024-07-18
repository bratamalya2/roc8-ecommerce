import { jwtVerify, ProtectedHeaderParameters } from "jose";

import type { User } from "~/types/User";

interface JWTVerification {
    payload: {
        user: User,
        iat: number;
        exp: number;
    },
    protectedHeader: ProtectedHeaderParameters
}

export default async function verifyAccessToken(accessToken: string) {
    try {
        const secretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY as string);

        const x: JWTVerification = await jwtVerify(accessToken, secretKey);

        return {
            isError: false,
            user: {
                id: x?.payload?.user?.id,
                email: x?.payload?.user?.email
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