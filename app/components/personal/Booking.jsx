"use client";
import { BedDouble, Calendar } from "lucide-react";
import React, { useState } from "react";
import {
  formatDateOnly,
  formatDateWithTime,
  formatDateInWords,
  formatDateWithDayName,
  formatDistanceFromNow,
  formatRelativeDate,
} from "@/app/utils/formatDates";
import Image from "next/image";
import clsx from "clsx";
import CheckOrders from "../rooms/CheckOrders";
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export default function Booking({ bookedRooms, setBookedRooms }) {
  // console.log(bookedRooms, "ggg");
  const [popupUpdate, setPopupUpdate] = useState(false);
  const [bookedRoomsData, setBookedRoomsData] = useState(bookedRooms);
  const [popupDelete, setPopupDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handlePopup = (roomDetails) => {
    setSelectedOrder(roomDetails);
    setPopupUpdate(true);
  };

  const activeRooms =
  bookedRoomsData?.filter((room) => room.isActive === true) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BedDouble size={22} className="text-blue-600" />
        החדרים שהזמנת
      </h2>

      {activeRooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <BedDouble size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">לא נמצאו הזמנות פעילות</p>
          <p className="text-gray-500 text-sm mt-1">הזמנות שתבצע יופיעו כאן</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {activeRooms.map((roomDetails, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium">
                  חדר מספר {roomDetails?.room?.roomNumber}
                </h3>
                <h3 className="font-medium">
                  מספר הזמנה {roomDetails?.bookingNumber}
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="w-full h-full">
                  <Image
                    src={roomDetails?.room?.imageUrl}
                    width={300}
                    height={200}
                    alt="תמונת החדר"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">תאריך כניסה</p>
                    <p className="font-medium">
                      {formatDateWithDayName(roomDetails?.checkInDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">תאריך יציאה</p>
                    <p className="font-medium">
                      {formatDateWithDayName(roomDetails?.checkOutDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">הזמנה נוצרה</p>
                    <p className="font-medium">
                      {formatDateWithTime(roomDetails?.createdAt)} <br />
                      <span className="text-sm text-gray-500">
                        ({formatRelativeDate(roomDetails?.createdAt)} -{" "}
                        {formatDistanceFromNow(roomDetails?.createdAt)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center py-1">
                <button
                  onClick={() => handlePopup(roomDetails)}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition text-white px-6 py-2 rounded-xl font-semibold"
                >
                  עדכן הזמנה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* לעדכן הזמנה */}
      {popupUpdate && selectedOrder && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <CheckOrders
            popupDelete={popupDelete}
            setPopupDelete={setPopupDelete}
            setBookedRoomsData={setBookedRoomsData}
            orderData={selectedOrder}
            setCheckOrder={setPopupUpdate}
            fromBooking={true} 
          />
        </div>
      )}
    </div>
  );
}