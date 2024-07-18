import { NextResponse } from "next/server";
import { headers } from "next/headers";

import verifyAccessToken from "./utils/verifyAccessToken";
import verifyRefreshToken from "./utils/verifyRefreshToken";
import fetchNewAccessToken from "./utils/fetchNewAccessToken";

import type { NextRequest } from "next/server";
import type { User } from "./types/User";

export async function middleware(request: NextRequest) {
    try {
        const headerList = headers();
        const accessToken = headerList.get("accessToken");
        const refreshToken = headerList.get("refreshToken");

        const requestHeaders = new Headers(request.headers);

        if (!accessToken)
            return NextResponse.json({
                isError: true,
                message: "Access Token is missing!"
            }, {
                status: 403
            });

        if (!refreshToken)
            return NextResponse.json({
                isError: true,
                message: "Refresh Token is missing!"
            }, {
                status: 403
            });

        const x = await verifyAccessToken(accessToken);

        if (x.isError) {
            const y = await verifyRefreshToken(refreshToken);
            if (y.isError) {
                //refresh token expired
                return NextResponse.json({
                    isError: true,
                    message: "Invalid tokens!"
                }, {
                    status: 401
                });
            }
            else {
                //get new access token
                const newAccessToken = await fetchNewAccessToken(y.user as User)
                return NextResponse.json({
                    isError: true,
                    message: "Access Token expired!",
                    accessToken: newAccessToken
                }, {
                    status: 401
                });
            }
        }
        else
            requestHeaders.set("user", JSON.stringify(x.user));

        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({
            isError: true
        }, {
            status: 500
        });
    }
}

export const config = {
    matcher: ["/api/addCategories", "/api/getAllCategories", "/api/removeCategories"]
};