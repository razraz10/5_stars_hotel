"use client";
import axiosSelf from "@/app/lib/axiosInstance";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Search, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

export default function AllRoomsAvailability() {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoomId, setLoadingRoomId] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(null);

  const router = useRouter();

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("יש לבחור תאריכי כניסה ויציאה");
      return;
    }

    try {
      setLoading(true);

      const formattedCheckIn = new Date(checkInDate);
      formattedCheckIn.setHours(0, 0, 0, 0);

      const formattedCheckOut = new Date(checkOutDate);
      formattedCheckOut.setHours(0, 0, 0, 0);

      const response = await axiosSelf.get(
        `/rooms/allRoomsCheck?` +
          `checkInDate=${formattedCheckIn.toISOString()}&` +
          `checkOutDate=${formattedCheckOut.toISOString()}`
      );

      setAvailableRooms(response.data.availableRooms);

      if (response.data.availableRooms.length === 0) {
        toast.error("אין חדרים פנויים בתאריכים אלו");
      } else {
        toast.success(
          `נמצאו ${response.data.availableRooms.length} חדרים פנויים`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "שגיאה בבדיקת זמינות");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setAvailableRooms(null);
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

        {(checkInDate || checkOutDate || availableRooms) && (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תאריך כניסה
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={setCheckInDate}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תאריך יציאה
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={setCheckOutDate}
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

      <button
        onClick={checkAvailability}
        disabled={loading}
        className="mt-6 cursor-pointer  bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl
        hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3
        shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
      >
        {loading ? (
          "בודק זמינות..."
        ) : (
          <>
            <Search size={20} />
            בדוק חדרים פנויים
          </>
        )}
      </button>

      {availableRooms && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            חדרים פנויים:{availableRooms.length}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRooms.map((room) => (
              <div
                key={room._id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="aspect-w-16 aspect-h-9 mb-2">
                  <img
                    src={room.imageUrl}
                    alt={`חדר ${room.roomNumber}`}
                    className="object-cover rounded-lg w-full h-48"
                  />
                </div>
                <h4 className="font-bold">חדר {room.roomNumber}</h4>
                <p className="text-gray-600">קומה {room.floor}</p>
                <p className="text-gray-600">{room.roomType}</p>
                <p className="text-gray-600">{room.view}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  ₪{room.price} ללילה
                </p>
                <div className="py-2 flex items-center ">
                  <button
                    onClick={() => {
                      setLoadingRoomId(room._id);
                      router.push(`/bookRoom/${room._id}`);
                    }}
                    disabled={loadingRoomId === room._id}
                    className={clsx(
                      `w-1/2 cursor-pointer bg-blue-500 text-white p-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2`,
                      {
                        "bg-blue-600": loadingRoomId === room._id,
                      }
                    )}
                  >
                    {loadingRoomId == room._id ? (
                      <span className="flex items-center justify-center gap-2">
                        טוען חדר...
                        <Image
                          src={"/waiting-7579_256.gif"}
                          width={30}
                          height={30}
                          alt="wait"
                        />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        הזמנת חדר
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
