"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  formatDateWithDayName,
  formatDateWithTime,
  formatDistanceFromNow,
  formatRelativeDate,
} from "@/app/utils/formatDates";
import {
  CalendarDays,
  Clock3,
  Hash,
  BedDouble,
  Info,
  CircleX,
  Hotel,
  User,
  Pen,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosSelf from "@/app/lib/axiosInstance";

export default function CheckOrders({
  orderData,
  setCheckOrder,
  setBookedRoomsData,
  bookedRooms,
  setBookedRooms,
}) {

  const [formData, setFormData] = useState({
    bookingNumber: orderData.bookingNumber,
    // המרת התאריכים לפורמט המקומי
    checkInDate: new Date(orderData.checkInDate).toLocaleDateString('en-CA'),
    checkOutDate: new Date(orderData.checkOutDate).toLocaleDateString('en-CA'),
    roomNumber: orderData.room.roomNumber,
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;

    // המרת התאריך לפורמט המקומי
    if (name === "checkInDate" || name === "checkOutDate") {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      setFormData((prev) => ({ ...prev, [name]: date.toLocaleDateString('en-CA') }));}
      else{
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
  };

  const changeOrder = async () => {
    try {
      const response = await axiosSelf.post(`/rooms/checkOrders`, formData);
      toast.success("הזמנה עודכנה בהצלחה");
      setCheckOrder(false);
      setBookedRoomsData((prevRooms) =>
        prevRooms.map((room) =>
          room.bookingNumber === formData.bookingNumber
            ? { ...room, ...formData }
            : room
        )
      );
    } catch (error) {
      if (error.response) {
        const { message, errors } = error.response.data;
        if (errors && Array.isArray(errors)) {
          const errorMessage = errors.join("\n");
          toast.error(errorMessage, {
            style: { textAlign: "right" },
          });
        } else {
          toast.error(message, {
            style: { textAlign: "right" },
          });
        }
      }
    }
  };

  const deleteOrder = async () => {
    try {
      const response = await axiosSelf.delete(`/rooms/checkOrders`, {
        data: { bookingNumber: formData.bookingNumber },
      });
      setCheckOrder(false);
      toast.success("הזמנה נמחקה בהצלחה");

      setBookedRoomsData((prevRooms) =>
        prevRooms.map((room) =>
          room.bookingNumber === formData.bookingNumber
            ? { ...room, isActive: false, isDeleted: true }
            : room
        )
      );
    } catch (error) {
      if (error.response) {
        const { message, errors } = error.response.data;
        if (errors && Array.isArray(errors)) {
          const errorMessage = errors.join("\n");
          toast.error(errorMessage, {
            style: { textAlign: "right" },
          });
        } else {
          toast.error(message, {
            style: { textAlign: "right" },
          });
        }
      }
    }
  };
  console.log(orderData);

  return (
    <div className="w-1/2 max-w-xl  max-h-[80vh] no-scrollbar overflow-y-auto mt-10 bg-white shadow-xl rounded-2xl  space-y-4">
      <div className="bg-blue-600 px-6 py-4 rounded-xl sticky top-0">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <h2 className="text-2xl font-bold text-white">פרטי הזמנה</h2>
            <Hotel className="text-white" size={28} />
          </div>
          <div
            className="flex justify-start cursor-pointer "
            onClick={() => setCheckOrder(false)}
          >
            <CircleX className="text-red-500" size={30} />
          </div>
        </div>
      </div>

      {orderData.isDeleted === true && (
        <div className="text-center text-red-600">
          כרגע ההזמנה מחוקה מהמערכת
        </div>
      )}
      
      {orderData.isActive === false && (
        <div className="text-center text-red-600">
          עבר זמן ההזמנה
        </div>
      )}

      {/* מספר הזמנה */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <Hash className="text-blue-500" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">מספר הזמנה</span>
          <span className="text-lg font-medium">{orderData.bookingNumber}</span>
        </div>
      </div>

      {/* שם המזמין */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <User className="text-cyan-600" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">שם המזמין</span>
          <div className="flex gap-1">
            <span className="text-lg font-medium">
              {orderData.user.firstName}
            </span>
            <span className="text-lg font-medium">
              {orderData.user.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* תאריך צ'ק אין */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <CalendarDays className="text-green-600" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">תאריך צ'ק אין</span>
          <span className="text-lg font-medium">
            {formatDateWithDayName(orderData.checkInDate)}
          </span>
          <div className="flex items-center ">
            <Pen color="blue" size={15} />
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              className="inputStyle bg-gray-300 rounded-2xl px-1"
            />
          </div>
        </div>
      </div>

      {/* תאריך צ'ק אאוט */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <CalendarDays className="text-red-500" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">תאריך צ'ק אאוט</span>
          <span className="text-lg font-medium">
            {formatDateWithDayName(orderData.checkOutDate)}
          </span>
          <div className="flex items-center ">
            <Pen color="blue" size={15} />
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              className="inputStyle bg-gray-300 rounded-2xl px-1"
            />
          </div>
        </div>
      </div>

      {/* תאריך יצירה */}
      <div className="flex items-start gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <Clock3 className="text-yellow-600 mt-1" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">תאריך יצירת ההזמנה</span>
          <span className="text-base">
            {formatDateWithTime(orderData.createdAt)}
          </span>
          <span className="text-sm text-gray-500">
            ({formatRelativeDate(orderData.createdAt)} -{" "}
            {formatDistanceFromNow(orderData.createdAt)})
          </span>
        </div>
      </div>

      {/* מספר חדר */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <BedDouble className="text-purple-600" />
        <div className="flex w-full  flex-col">
          <div className="flex justify-around">
            <div className="flex flex-col">
              <span className="text-sm text-start pr-6 text-gray-600">
                מספר חדר
              </span>
              <span className="text-lg text-start pr-12 font-medium">
                {orderData.room.roomNumber || "..."}
              </span>
              <div className="flex items-center ">
                <Pen color="blue" size={15} />
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  maxLength={8}
                  placeholder="מספר חדר"
                  className="inputStyle bg-gray-300 w-1/2 rounded-2xl text-center "
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">קומת חדר</span>
              <span className="text-lg text-center font-medium">
                {orderData.room.floor || "..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* סטטוס */}
      <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <Info className="text-cyan-600" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">סטטוס ההזמנה</span>
          <span className="text-lg font-medium">{orderData.status}</span>
        </div>
      </div>

      {/* עדכון אחרון */}
      <div className="flex items-start gap-3 bg-gray-50 p-2 rounded-lg shadow-sm">
        <Clock3 className="text-gray-700 mt-1" />
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">עודכן לאחרונה</span>
          <span className="text-base">
            {formatDateWithTime(orderData.updatedAt)}
          </span>
          <span className="text-sm text-gray-500">
            ({formatRelativeDate(orderData.updatedAt)} -{" "}
            {formatDistanceFromNow(orderData.updatedAt)})
          </span>
        </div>
      </div>

      {/* כפתור עדכון */}
      <div className="flex justify-center py-1 px-1 gap-3">
        {orderData.isDeleted === true ? (
          <button
            onClick={changeOrder}
            className="bg-blue-600 px-3 cursor-pointer hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold"
          >
            שחזר הזמנה
          </button>
        ) : (
          <>
            <button
              onClick={changeOrder}
              className="bg-blue-600 w-3/4 cursor-pointer hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold"
            >
              עדכן הזמנה
            </button>
            <button
              onClick={deleteOrder}
              className="bg-red-600 w-1/4 cursor-pointer hover:bg-red-700 transition text-white py-2 rounded-xl font-semibold"
            >
              מחק הזמנה
            </button>
          </>
        )}
      </div>
    </div>
  );
}
