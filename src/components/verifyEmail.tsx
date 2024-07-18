"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import type { ApiResponse } from "~/types/ApiResponse";

function VerifyEmail({ email }: { email: string | null }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const one = useRef<HTMLInputElement>(null);
    const two = useRef<HTMLInputElement>(null);
    const three = useRef<HTMLInputElement>(null);
    const four = useRef<HTMLInputElement>(null);
    const five = useRef<HTMLInputElement>(null);
    const six = useRef<HTMLInputElement>(null);
    const seven = useRef<HTMLInputElement>(null);
    const eight = useRef<HTMLInputElement>(null);

    const handleVerify = async () => {
        try {
            const otp = (one.current!.value + two.current!.value + three.current!.value + four.current!.value + five.current!.value + six.current!.value + seven.current!.value + eight.current!.value);
            if (otp.length === 8) {
                const x = await fetch("/api/verifyEmail", {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        otp
                    })
                });
                const apiResponse = (await x.json()) as ApiResponse;
                if (apiResponse.isError)
                    enqueueSnackbar(apiResponse.message, {
                        variant: "error"
                    });
                else
                    router.push(`/login`);
            }
            else
                enqueueSnackbar("Enter all the 8 digits please!", {
                    variant: "error"
                });
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (email) {
            setStart(email?.substring(0, 3));
            setEnd(`@${email.split("@")[1]}`)
        }
    }, [email])

    return <section className="w-[95%] md:w-[50%] h-[453px] border border-[#C1C1C1] rounded-[20px] flex flex-col items-center py-10 px-[2%]">
        <p className="font-semibold text-lg sm:text-3xl">Verify your email</p>
        <p className="my-5 text-center">Enter the 8 digit code you have received on <span className="font-medium">{start}***{end}</span></p>
        <p className="self-start my-5 ml-10 sm:ml-14">Code</p>
        <aside className="flex items-center justify-center w-full mx-auto gap-x-1.5">
            <input type="number" ref={one} onKeyUp={() => {
                const digit = one?.current?.value;
                if (digit!.length > 1)
                    one.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    two?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={two} onKeyUp={() => {
                const digit = two?.current?.value;
                if (digit!.length > 1)
                    two.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    three?.current?.focus();
                else if (digit!.length === 0)
                    one?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={three} onKeyUp={() => {
                const digit = three?.current?.value;
                if (digit!.length > 1)
                    three.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    four?.current?.focus();
                else if (digit!.length === 0)
                    two?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={four} onKeyUp={() => {
                const digit = four?.current?.value;
                if (digit!.length > 1)
                    four.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    five?.current?.focus();
                else if (digit!.length === 0)
                    three?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={five} onKeyUp={() => {
                const digit = five?.current?.value;
                if (digit!.length > 1)
                    five.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    six?.current?.focus();
                else if (digit!.length === 0)
                    four?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={six} onKeyUp={() => {
                const digit = six?.current?.value;
                if (digit!.length > 1)
                    six.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    seven?.current?.focus();
                else if (digit!.length === 0)
                    five?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={seven} onKeyUp={() => {
                const digit = seven?.current?.value;
                if (digit!.length > 1)
                    seven.current!.value = digit!.substring(0, 1)!;
                else if (!isNaN(parseInt(digit!)))
                    eight?.current?.focus();
                else if (digit!.length === 0)
                    six?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
            <input type="number" ref={eight} onKeyUp={() => {
                const digit = eight?.current?.value;
                if (digit!.length > 1)
                    eight.current!.value = digit!.substring(0, 1)!;
                else if (digit!.length === 0)
                    seven?.current?.focus();
            }} className="border border-[#C1C1C1] w-[20px] h-[30px] sm:w-[46px] sm:h-[48px] rounded-[6px] special-number-input p-[15px] text-sm font-semibold" />
        </aside>
        <button className="my-12 uppercase font-medium text-sm sm:text-base tracking-[7%] text-white bg-black border border-black rounded-[6px] w-full h-[56px] mx-auto" onClick={handleVerify}>Verify</button>
    </section>
}

export default VerifyEmail;