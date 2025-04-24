"use client";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  Bed,
  Bath,
  Maximize,
  Calendar,
  CreditCard,
  Check,
  Telescope,
  X,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import axiosSelf from "@/app/lib/axiosInstance";

export default function page() {
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  // console.log(user);
  const router = useRouter();

  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchRoom = async () => {
    const response = await axiosSelf.get(`/roomId/${id}`);
    const data = response.data;
    setRoom(data);
  };

  useEffect(() => {
    if(!user){
      router.push('/login')
    }
    fetchRoom();
  }, [id]);

  const handleReservation = async () => {
    if (!startDate && !endDate) {
      toast.error("יש לבחור תאריכים להזמנה");
      return;
    }
    if (!startDate) {
      toast.error("יש לבחור תאריך התחלה להזמנה");
      return;
    }
    if (!endDate) {
      toast.error("יש לבחור תאריך סיום להזמנה");
      return;
    }

    try {
      const checkInDate = startDate;
      const checkOutDate = endDate;
      await axiosSelf.post(`/roomId/${id}`, {
        userId: user._id,
        roomId: room.id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
      });
      setLoading(true);
      toast.success("החדר הוזמן בהצלחה");
      setLoading(false);
    } catch (error) {
      console.error(error);

      setLoading(false);
      toast.error(error?.response?.data?.message || "שגיאה בהזמנה");
    }
    // שלח בקשת הזמנה לשרת עם התאריכים
    console.log("הזמנה:", {
      startDate,
      endDate,
      roomId: id,
      userId: user?._id,
    });
  };

  if (!room) {
    return (
      <div className="p-6 flex-col items-center justify-center text-center">
        <div className="text-4xl">טוען חדר</div>
        <div className="flex items-center justify-center">
          <Image
            src={"/Animation - 1744186901254.gif"}
            width={200}
            height={200}
            alt="loading"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative h-[500px] lg:h-full">
              <img
                src={
                  room?.imageUrl ||
                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80"
                }
                alt={room?.roomType}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {room?.availability && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  זמין להזמנה
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {room?.roomType}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Telescope className="w-5 h-5" />
                  <span>{room?.view}</span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {room?.description}
                </p>
              </div>

              {/* Room Features */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">מאפייני החדר</h2>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <span>{room?.bedType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-5 h-5 text-blue-600" />
                    <span>{room?.bathroomType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize className="w-5 h-5 text-blue-600" />
                    <span>{room?.roomSize} מ"ר</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Telescope className="w-5 h-5 text-blue-600" />
                    <span>{room?.view}</span>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { condition: room?.airConditioning, label: "מיזוג אוויר" },
                    { condition: room?.dailyCleaning, label: "ניקיון יומי" },
                    { condition: room?.smokingAllowed, label: "עישון" },
                    { condition: room?.petsAllowed, label: "חיות מחמד" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {feature.condition ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">₪{room?.price}</span>
                  <span className="text-gray-600">/ ללילה</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">בחר תאריכים</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        צ'ק-אין
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          if (endDate && date > endDate) setEndDate(null);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="בחר תאריך"
                        showPopperArrow={false}
                        // className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        צ'ק-אאוט
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="בחר תאריך"
                        showPopperArrow={false}
                        // className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleReservation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 mt-4"
                  >
                    {loading ? "מזמין..." : "הזמן עכשיו"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
