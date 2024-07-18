"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";

import type { ApiResponse } from "~/types/ApiResponse";

function Login() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordVisibilityText, setPasswordVisibilityText] = useState<string>("Show");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(curr => !curr);
        if (passwordVisibilityText === "Show")
            setPasswordVisibilityText("Hide");
        else
            setPasswordVisibilityText("Show");
    };

    const handleLogin = async () => {
        try {
            const x = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const apiResponse = (await x.json()) as ApiResponse;
            if (!apiResponse.isError) {
                localStorage.setItem("accessToken", apiResponse.accessToken!);
                localStorage.setItem("refreshToken", apiResponse.refreshToken!)
                router.push(`/home`);
            }
            else {
                if (apiResponse.message === "User not verified!")
                    router.push(`/verifyEmail?email=${email}`);
                else
                    enqueueSnackbar(apiResponse.message, {
                        variant: "error"
                    });
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return <section className="w-[50%] h-[691px] border border-[#C1C1C1] rounded-[20px] flex flex-col items-center py-10">
        <p className="font-semibold text-lg sm:text-3xl text-center">Login</p>
        <p className="mt-14 text-lg sm:text-2xl font-medium text-center">Welcome back to ECOMMERCE</p>
        <p className="mt-5 mb-14 text-xs sm:text-base text-center">The next gen business marketplace</p>
        <div className="my-5 w-[80%] mx-auto">
            <label>Email</label>
            <br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={`border border-[#C1C1C1] rounded-[6px] h-[48px] px-2 w-full text-xs sm:text-base`} />
        </div>
        <div className="my-5 w-[80%] mx-auto relative">
            <label>Password</label>
            <br />
            <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={`border border-[#C1C1C1] rounded-[6px] h-[48px] px-2 w-full text-xs sm:text-base`} />
            <div className="absolute right-2 bottom-3 underline hover:cursor-pointer text-xs sm:text-base" onClick={togglePasswordVisibility}>{passwordVisibilityText}</div>
        </div>
        <button className="my-5 uppercase font-medium text-sm sm:text-base tracking-[7%] text-white bg-black border border-black rounded-[6px] w-[80%] h-[56px] mx-auto" onClick={handleLogin}>Login</button>
        <div className="w-[80%] h-[1px] bg-[#C1C1C1] my-3"></div>
        <div className="text-xs text-center sm:text-base">Don&apos;t have an Account? <Link href="/"><span className="uppercase font-medium hover:cursor-pointer">Sign up</span></Link></div>
    </section>
}

export default Login;