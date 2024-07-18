import { SignJWT } from "jose";

import type { User } from "~/types/User";

export default async function fetchNewAccessToken(user: User) {
    try {
        const accessTokenSecretKey = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY as string);
        let accessToken: string | null = null;
        accessToken = await new SignJWT({
            user
        })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setIssuedAt()
            .setExpirationTime("10m") // Token expires in 10 minutes
            .sign(accessTokenSecretKey);
        return accessToken;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}