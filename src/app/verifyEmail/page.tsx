"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import VerifyEmail from "~/components/verifyEmail";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    return <Suspense>
        <main className="flex w-full min-h-[780px] items-center justify-center">
            <VerifyEmail email={email} />
        </main>
    </Suspense>
}