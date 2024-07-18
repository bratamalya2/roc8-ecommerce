"use client";

import { useEffect } from "react";

import SignUp from "~/components/signup";

import type { InitResponse } from "~/types/InitResponse";

export default function HomePage() {
  const initDB = async () => {
    try {
      const x = await fetch("/api/init", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      const y = (await x.json()) as InitResponse;
      if (y.isError)
        window.location.reload();
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initDB();
  }, []);

  return (
    <main className="flex w-full min-h-[780px] items-center justify-center">
      <SignUp />
    </main>
  );
}
