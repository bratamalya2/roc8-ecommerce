"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSnackbar } from "notistack";

import Loading from "~/../public/loading.gif";

function SignUp() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailIncorrectText, setEmailIncorrectText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
        if (!regex.test(email) && email.length > 0)
            setEmailIncorrectText("Incorrect email address");
        else
            setEmailIncorrectText("");
    }, [email]);

    const handleSignup = async () => {
        try {
            if (isLoading)
                return;
            setIsLoading(true);
            if (name.length > 0 && emailIncorrectText.length === 0 && password.length > 7) {
                const x = await fetch("/api/signup", {
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });
                const apiResponse = await x.json();
                if (apiResponse)
                    setIsLoading(false);
                if (!apiResponse.isError)
                    router.push(`/verifyEmail?email=${email}`);
                else
                    enqueueSnackbar(apiResponse.message, {
                        variant: "error"
                    });
            }
            else {
                //incorrect input
                enqueueSnackbar("Wrong inputs!", {
                    variant: "error"
                });
                setIsLoading(false);
            }
        }
        catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    return <section className="w-[50%] h-[691px] border border-[#C1C1C1] rounded-[20px] flex flex-col items-center py-10">
        <p className="font-semibold text-lg sm:text-3xl">Create your account</p>
        <div className="my-5 w-[80%] mx-auto">
            <label>Name</label>
            <br />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className={`border border-[#C1C1C1] focus:outline-0 rounded-[6px] h-[48px] px-2 w-full ${name.length > 0 && "focus:border-green-500 focus:outline-0"}`} />
        </div>
        <div className="my-5 w-[80%] mx-auto">
            <label>Email</label>
            <br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className={`border border-[#C1C1C1] rounded-[6px] h-[48px] px-2 w-full ${emailIncorrectText.length === 0 && email.length > 0 && "focus:border-green-500 focus:outline-0"}`} />
            <br />
            <div className="text-red-500 text-xs font-semibold mt-2">{emailIncorrectText}</div>
        </div>
        <div className="my-5 w-[80%] mx-auto">
            <label>Password</label>
            <br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={`border border-[#C1C1C1] rounded-[6px] h-[48px] px-2 w-full ${password.length > 7 && "focus:border-green-500 focus:outline-0"}`} />
            <br />
            <div className={`text-red-500 text-xs font-semibold mt-2 ${(password.length === 0 || password.length > 7) && "invisible"}`}>Password length must greater than or equal to 8 characters</div>
        </div>
        {!isLoading && <button className="my-5 uppercase font-medium text-sm sm:text-base tracking-[7%] text-white bg-black border border-black rounded-[6px] w-[80%] h-[56px] mx-auto" onClick={handleSignup}>Create account</button>}
        {isLoading && <button className="flex items-center justify-center my-5 uppercase font-medium text-sm sm:text-base tracking-[7%] text-white bg-black border border-black rounded-[6px] w-[80%] h-[56px] mx-auto" onClick={handleSignup}>
            <Image src={Loading} alt="loading" className="inline-block sm:w-[140px] w-[50px]" />
            <span>Loading...</span>
        </button>}
        <div className="text-sm sm:text-base">Have an Account? <Link href="/login"><span className="uppercase font-medium hover:cursor-pointer">Login</span></Link></div>
    </section>
}

export default SignUp;