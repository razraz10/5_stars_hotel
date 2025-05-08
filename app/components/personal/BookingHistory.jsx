"use client";
import { BedDouble, Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";
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

export default function BookingHistory({ bookedRooms }) {
    const [bookedRoomsData, setBookedRoomsData] = useState(bookedRooms);
  const activeRooms = bookedRoomsData?.filter((room) => room.isActive === false) || [];
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BedDouble size={22} className="text-blue-600" />
         היסטוריית החדרים שהזמנת
      </h2>

      {activeRooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <BedDouble size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">לא נמצא היסטוריית הזמנות </p>
          <p className="text-gray-500 text-sm mt-1">הזמנות שיעבור תוקפן יופיעו כאן</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRooms.map((roomDetails, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  `border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition`
                )}
              >
                <div className="bg-gray-400 px-4 py-2 border-b border-gray-200">
                  <h3 className="font-medium">
                    חדר מספר {roomDetails?.room?.roomNumber}
                  </h3>
                  <h3 className="font-medium">
                    {" "}
                    מספר הזמנה {roomDetails?.bookingNumber}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
