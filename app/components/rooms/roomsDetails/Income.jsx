"use client";
import axiosSelf from "@/app/lib/axiosInstance";
import React, { useEffect, useState } from "react";

export default function Income() {
  const [income, setIncome] = useState({
    monthly: 0,
    yearly: 0,
    total: 0,
  });

  // פונקציה לטעינת נתוני הרווחים
  const getIncome = async () => {
    try {
      const response = await axiosSelf.get("/rooms/income");
      // console.log(response.data);

      setIncome(response.data);
    } catch (error) {
      console.error("שגיאה בטעינת נתוני הרווחים:", error);
    }
  };

  useEffect(() => {
    getIncome();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6 mt-3">
      <div
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
            url("/dollar-5360053_1920.jpg")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="text-xl font-bold mb-2">רווחים חודשיים</div>
        <div className="text-2xl font-bold mb-2">₪{income.monthly || 0}</div>
      </div>
      <div
        style={{
          backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
          url("/dollar-5360053_1920.jpg")
        `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="text-xl font-bold mb-2">רווחים שנתיים</div>
        <div className="text-2xl font-bold mb-2">₪{income.yearly || 0}</div>
      </div>
      <div
        style={{
          backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
        url("/dollar-5360053_1920.jpg")
      `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
        className={`bg-white p-6 rounded-xl shadow-sm`}
      >
        <div className=" text-xl font-bold mb-2">רווחים עד היום</div>
        <div className="text-2xl font-bold mb-2">₪{income.total || 0}</div>
      </div>
    </div>
  );
}
