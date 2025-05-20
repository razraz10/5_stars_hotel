"use client";
import axiosSelf from "@/app/lib/axiosInstance";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BedDouble, Calendar, CalendarDays, CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { is } from "date-fns/locale";

export default function RoomAvailability() {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);

  const checkAvailability = async () => {
    if (!checkInDate && !checkOutDate && !roomNumber) {
      toast.error("יש לבחור תאריכים ומספר חדר לבדיקת זמינות");
      return;
    }
    if (!checkInDate) {
      toast.error("יש לבחור תאריך התחלה לבדיקת זמינות");
      return;
    }
    if (!checkOutDate) {
      toast.error("יש לבחור תאריך סיום לבדיקת זמינות");
      return;
    }
    if (!roomNumber) {
      toast.error("יש לבחור מספר חדר לבדיקת זמינות");
      return;
    }
    try {
      setLoading(true);

      // תיקון הטיפול בתאריכים
      const formattedCheckIn = new Date(checkInDate);
      formattedCheckIn.setHours(0, 0, 0, 0);

      const formattedCheckOut = new Date(checkOutDate);
      formattedCheckOut.setHours(0, 0, 0, 0);

    //   console.log("Selected dates:", {
    //     checkIn: checkInDate.toLocaleDateString(),
    //     checkOut: checkOutDate.toLocaleDateString(),
    //   });

    //   console.log("Formatted dates:", {
    //     checkIn: formattedCheckIn.toISOString(),
    //     checkOut: formattedCheckOut.toISOString(),
    //   });

      const response = await axiosSelf.get(
        `/rooms/OneRoomCheck?` +
          `checkInDate=${formattedCheckIn.toISOString()}&` +
          `checkOutDate=${formattedCheckOut.toISOString()}&` +
          `roomNumber=${roomNumber}`
      );

      const { isAvailable, existBooking } = response.data;

      console.log("Server response:", {
        isAvailable,
        existBooking,
      });

      setAvailability({
        isAvailable,
        existingBookings: existBooking || [],
      });

      toast[isAvailable ? "success" : "error"](
        isAvailable ? "החדר פנוי בתאריכים שנבחרו" : "החדר תפוס בתאריכים שנבחרו"
      );
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error(error.response?.data?.message || "שגיאה בבדיקת זמינות החדר");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setRoomNumber("");
    setAvailability(null);
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg mb-3 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            בדיקת זמינות חדר
          </h2>
        </div>
  
        {(checkInDate || checkOutDate || roomNumber || availability) && (
          <button
            onClick={resetForm}
            className="bg-white cursor-pointer px-4 py-2 rounded-xl hover:bg-red-50 border border-red-200 text-red-500 
            transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            איפוס בדיקה
            <XCircle className="text-red-500" size={20} />
          </button>
        )}
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            מספר חדר
          </label>
          <div className="relative">
            <input
              type="number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-2 pl-10 focus:border-blue-500 
              focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none
              [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="הזן מספר חדר"
            />
          </div>
        </div>
  
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            תאריך כניסה
          </label>
          <div className="relative">
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="בחר תאריך"
              className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 
              focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
            />
          </div>
        </div>
  
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            תאריך יציאה
          </label>
          <div className="relative">
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate || new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="בחר תאריך"
              className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:border-blue-500 
              focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </div>
  
      <button
        onClick={checkAvailability}
        disabled={loading}
        className="mt-6 cursor-pointer  bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl
        hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3
        shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
      >
        {loading ? (
          <div className="flex items-center  gap-2">
            <Loader2 className="animate-spin" size={20} />
            בודק זמינות...
          </div>
        ) : (
          <div className="flex items-center  gap-2">
            <Search size={20} />
            בדוק זמינות
          </div>
        )}
      </button>
  
      {availability && (
        <div className="mt-6">
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              availability.isAvailable 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}
          >
            {availability.isAvailable ? (
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={24} />
                <p className="text-green-700 text-lg font-medium">
                  החדר פנוי בתאריכים המבוקשים
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <XCircle className="text-red-500" size={24} />
                  <p className="text-red-700 text-lg font-medium">
                    החדר תפוס בתאריכים הבאים:
                  </p>
                </div>
                <ul className="space-y-3">
                  {availability.existingBookings.map((booking, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-2 bg-white p-3 rounded-xl border border-red-100"
                    >
                      <Calendar className="text-gray-400" size={18} />
                      <span>
                        {new Date(booking.checkInDate).toLocaleDateString("he-IL")} -
                        {new Date(booking.checkOutDate).toLocaleDateString("he-IL")}
                      </span>
                      <span className="text-gray-500 mr-2">
                        (מספר הזמנה: {booking.bookingNumber})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
