"use client";
import React from "react";
import { CircleX, CheckCheck, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PopupDeleteOrder({ 
  bookingNumber, 
  closePopup, 
  fromBooking = false 
}) {
  const router = useRouter();

  const handleClose = () => {
    if (closePopup) {
      closePopup();
    }
    
    // If coming from the Booking component, refresh the user's bookings
    if (fromBooking) {
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle size={24} className="text-yellow-500" />
          <h2 className="text-xl font-semibold">אזהרה לפני מחיקת הזמנה</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <CircleX size={24} />
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-full">
            <AlertTriangle className="text-yellow-600" size={20} />
          </div>
          <p className="text-yellow-800">
            שים לב! אם תרצה לשחזר את ההזמנה לאחר המחיקה, תחויב בעמלת שחזור.
          </p>
        </div>
      </div>

      <div className="text-gray-600 mb-6">
        <p>
          אם ברצונך לשחזר את ההזמנה לאחר המחיקה, תחויב בעמלה ותצטרך לפנות למנהל המערכת או לחפש את ההזמנה באמצעות מספר ההזמנה.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
        >
          ביטול
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          אני מבין, מחק בכל זאת
        </button>
      </div>
    </div>
  );
}