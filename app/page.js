"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    // if (!user) {
      router.push("/home");
    // }
  }, []);

  return (
      <div>
    </div>
  );
}
