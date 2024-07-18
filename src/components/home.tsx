"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { Category } from "~/types/Category";

export default function Home() {
    const router = useRouter();
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [currentlySelectedCategories, setCurrentlySelectedCategories] = useState<Category[]>([]);
    const [currentlyRemovedCategories, setCurrentlyRemovedCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageArr, setPageArr] = useState<number[]>([]);
    const [currentIndexArr, setCurrentIndexArr] = useState<number[]>([]);

    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [minPage, setMinPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);

    const fetchAvailableCategories = async () => {
        try {
            const x = await fetch("/api/getAvailableCategories");
            const apiResponse = await x.json();
            if (apiResponse.isError)
                setAvailableCategories([]);
            else
                setAvailableCategories(apiResponse.categories);
        }
        catch (err) {
            console.log(err);
            setAvailableCategories([]);
        }
    };

    const fetchSelectedCategories = async () => {
        try {
            let accessToken = localStorage.getItem("accessToken");
            let refreshToken = localStorage.getItem("refreshToken");

            let myHeaders = new Headers();
            myHeaders.append("accessToken", accessToken!);
            myHeaders.append("refreshToken", refreshToken!);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const x = await fetch("/api/getAllCategories", requestOptions as RequestInit);
            const apiResponse = await x.json();
            if (apiResponse.isError) {
                if (apiResponse.message === "Access Token expired!") {
                    accessToken = apiResponse.accessToken;
                    localStorage.setItem("accessToken", apiResponse.accessToken!);
                    myHeaders = new Headers();
                    myHeaders.append("accessToken", accessToken!);
                    myHeaders.append("refreshToken", refreshToken!);
                    requestOptions.headers = myHeaders;
                    const x2 = await fetch("/api/getAllCategories", requestOptions as RequestInit);
                    const apiResponse2 = await x2.json();
                    setSelectedCategories(apiResponse2.selectedCategories);
                    localStorage.setItem("selectedCategories", JSON.stringify(apiResponse2.selectedCategories));
                }
                else {
                    setSelectedCategories([]);
                    router.push(`/login`);
                }
            }
            else {
                localStorage.setItem("selectedCategories", JSON.stringify(apiResponse.selectedCategories));
                setSelectedCategories(apiResponse.selectedCategories);
            }
        }
        catch (err) {
            console.log(err);
            setSelectedCategories([]);
        }
    };

    const removeCategories = async () => {
        try {
            const removeCats: Category[] = JSON.parse(localStorage.getItem("currentlyRemovedCategories")!);
            if (removeCats === null)
                return;
            let accessToken = localStorage.getItem("accessToken");
            let refreshToken = localStorage.getItem("refreshToken");

            let myHeaders = new Headers();
            myHeaders.append("accessToken", accessToken!);
            myHeaders.append("refreshToken", refreshToken!);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify(removeCats)
            };

            const x = await fetch("/api/removeCategories", requestOptions as RequestInit);
            const apiResponse = await x.json();
            if (apiResponse.isError) {
                if (apiResponse.message === "Access Token expired!") {
                    accessToken = apiResponse.accessToken;
                    localStorage.setItem("accessToken", apiResponse.accessToken!);
                    myHeaders = new Headers();
                    myHeaders.append("accessToken", accessToken!);
                    myHeaders.append("refreshToken", refreshToken!);
                    requestOptions.headers = myHeaders;
                    const x2 = await fetch("/api/removeCategories", requestOptions as RequestInit);
                    await x2.json();
                    fetchSelectedCategories();
                }
                else {
                    setSelectedCategories([]);
                    router.push(`/login`);
                }
            }
            else
                fetchSelectedCategories();
        }
        catch (err) {
            console.log(err);
        }
    };

    const addNewCategories = async () => {
        try {
            if (!localStorage.getItem("currentlySelectedCategories"))
                return;

            const currentlySelectedCats = JSON.parse(localStorage.getItem("currentlySelectedCategories")!) as Category[], newCats: Category[] = [];
            const currentlySelectedCatIds = currentlySelectedCats.map(a => a.id);
            const selectedCatIds = JSON.parse(localStorage.getItem("selectedCategories")!).map((a: Category) => a.id);
            const nonMathcingIds: number[] = currentlySelectedCatIds.filter(a => !selectedCatIds.includes(a));
            const nonMatchingCategories: Category[] = currentlySelectedCats.filter(a => nonMathcingIds.includes(a.id));

            if (nonMatchingCategories.length === 0)
                return;

            let accessToken = localStorage.getItem("accessToken");
            let refreshToken = localStorage.getItem("refreshToken");

            let myHeaders = new Headers();
            myHeaders.append("accessToken", accessToken!);
            myHeaders.append("refreshToken", refreshToken!);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow",
                body: JSON.stringify(nonMatchingCategories)
            };

            const x = await fetch("/api/addCategories", requestOptions as RequestInit);
            const apiResponse = await x.json();
            if (apiResponse.isError) {
                if (apiResponse.message === "Access Token expired!") {
                    accessToken = apiResponse.accessToken;
                    localStorage.setItem("accessToken", apiResponse.accessToken!);
                    myHeaders = new Headers();
                    myHeaders.append("accessToken", accessToken!);
                    myHeaders.append("refreshToken", refreshToken!);
                    requestOptions.headers = myHeaders;
                    const x2 = await fetch("/api/addCategories", requestOptions as RequestInit);
                    await x2.json();
                    fetchSelectedCategories();
                }
                else {
                    setSelectedCategories([]);
                    router.push(`/login`);
                }
            }
            else
                fetchSelectedCategories();
        }
        catch (err) {
            console.log(err);
            setSelectedCategories([]);
        }
    };

    const handleCheckboxClick = (id: number) => {
        if (!currentlySelectedCategories.map(x => x.id).includes(availableCategories[id]?.id!)) {
            const arr = [...currentlySelectedCategories];
            arr.push(availableCategories[id]!);
            setCurrentlySelectedCategories(arr);
            localStorage.setItem("currentlySelectedCategories", JSON.stringify(arr));
        }
        else {
            setCurrentlySelectedCategories(curr => {
                let a = [...curr];
                a = a.filter(obj => obj.id !== availableCategories[id]?.id!);
                localStorage.setItem("currentlySelectedCategories", JSON.stringify(a));
                return a;
            });
            setCurrentlyRemovedCategories(curr => {
                let a = [...curr];
                a.push(availableCategories[id]!);
                localStorage.setItem("currentlyRemovedCategories", JSON.stringify(a));
                return a;
            });
        }
        if (currentlyRemovedCategories.map(x => x.id).includes(availableCategories[id]?.id!)) {
            let arr = [...currentlyRemovedCategories];
            arr = arr.filter(x => x.id !== availableCategories[id]?.id!);
            setCurrentlyRemovedCategories(arr);
            localStorage.setItem("currentlyRemovedCategories", JSON.stringify(arr));
        }
    };

    useEffect(() => {
        fetchAvailableCategories();
        fetchSelectedCategories();
    }, []);

    useEffect(() => {
        setCurrentlySelectedCategories(selectedCategories);
    }, [selectedCategories]);

    useEffect(() => {
        setMaxIndex(availableCategories.length);
        let totalPages: number;
        if (availableCategories.length % 6 === 0)
            totalPages = availableCategories.length / 6;
        else
            totalPages = Math.floor(availableCategories.length / 6) + 1;
        setMaxPage(totalPages - 1);
    }, [availableCategories]);

    useEffect(() => {
        window.addEventListener("beforeunload", (e: Event) => {
            e.preventDefault();
            addNewCategories();
            removeCategories();
            localStorage.removeItem("selectedCategories");
            localStorage.removeItem("currentlySelectedCategories");
            localStorage.removeItem("currentlyRemovedCategories");
        });
    }, [currentPage]);

    useEffect(() => {
        const arr: number[] = [];
        for (let i = currentPage - 4; i <= currentPage + 3; i++) {
            if (i < minPage || i > maxPage)
                continue;
            else
                arr.push(i + 1);
        }
        setPageArr(arr);

        let arr2: number[] = [];
        for (let i = currentPage * 6; i < (currentPage + 1) * 6; i++) {
            if (i >= availableCategories.length)
                break;
            arr2.push(i);
        }
        setCurrentIndexArr(arr2);
    }, [availableCategories, currentPage, maxPage]);

    return <section className="w-[50%] h-[658px] border border-[#C1C1C1] rounded-[20px] flex flex-col items-center py-10 px-10">
        <p className="font-semibold text-3xl my-5">Please mark your interests!</p>
        <p className="my-3">We will keep you notified.</p>
        <p className="my-2 font-medium text-xl self-start">My saved interests!</p>
        <section className="self-start flex flex-col justify-around my-12 gap-y-3">
            {
                currentIndexArr.map((index) =>
                    <div key={index} className="flex">
                        <input
                            type="checkbox"
                            id={availableCategories[index]?.id!.toString()}
                            className="w-[24px] h-[24px] rounded-[4px] accent-black hover:cursor-pointer"
                            onChange={() => handleCheckboxClick(availableCategories[index]?.id! - 1)}
                            checked={currentlySelectedCategories?.map(x => x.id).includes(availableCategories[index]?.id!) || false}
                        />
                        <label htmlFor={availableCategories[index]?.id!.toString()} className="ml-5">{availableCategories[index]?.name}</label>
                    </div>
                )
            }
        </section>
        <section className="flex w-[50%] justify-between self-start my-5">
            <div className="hover:cursor-pointer" onClick={() => setCurrentPage(minPage)}>&lt;&lt;</div>
            <div className="hover:cursor-pointer" onClick={() => {
                if (currentPage > 0)
                    setCurrentPage((curr) => curr - 1);
            }}>&lt;</div>
            {
                pageArr.map((pageNumber, i) => {
                    if (pageNumber === (currentPage + 1))
                        return <div key={i} className="font-semibold">{pageNumber}</div>
                    else
                        return <div key={i} className="hover:cursor-pointer" onClick={() => setCurrentPage(pageNumber - 1)}>{pageNumber}</div>
                })
            }
            <div className="hover:cursor-pointer" onClick={() => {
                if (currentPage < maxPage)
                    setCurrentPage((curr) => curr + 1);
            }}>&gt;</div>
            <div className="hover:cursor-pointer" onClick={() => setCurrentPage(maxPage)}>&gt;&gt;</div>
        </section>
    </section>
}