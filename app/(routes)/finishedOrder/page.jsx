"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  useEffect(() => {
    const confirmed = localStorage.getItem("orderConfirmed");
    if (!confirmed) {
      router.push("/home");
    }
  }, []);

  const returnHome = () => {
    router.push("/home");
    localStorage.removeItem("orderConfirmed");
  };
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full text-center p-8">
        <CheckCircle className="mx-auto text-green-500" size={64} />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          ההזמנה התקבלה בהצלחה
        </h2>
        <p className="text-gray-600 mt-2">
          תודה שהזמנת אצלנו. שלחנו אליך מייל עם פרטי ההזמנה.
        </p>

        <button
          onClick={returnHome}
          className="mt-6 cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
        >
          חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}
