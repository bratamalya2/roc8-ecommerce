"use client";

import { useSearchParams } from "next/navigation";

import VerifyEmail from "~/components/verifyEmail";

export default function verifyEmail() {
    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    return <main className="flex w-full min-h-[780px] items-center justify-center">
        <VerifyEmail email={email} />
    </main>
}