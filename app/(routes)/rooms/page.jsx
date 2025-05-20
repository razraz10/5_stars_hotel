"use client";
import { useAuthStore } from "@/app/store/authStore";
import clsx from "clsx";
import {
  Check,
  Telescope,
  Wifi,
  Dog,
  CookingPot as Smoking,
  Bath,
  Wind,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [rooms, setRooms] = useState(null);
  const [loadingRoomId, setLoadingRoomId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4;

  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (user) {
      fetch("/api/rooms")
        .then((res) => res.json()) // ממיר את התגובה ל-JSON
        .then((data) => {
          const filter = data.filter((room) => room.active === true);
          setRooms(filter);
        });
    }
  }, [user, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!user) return null;

  if (!rooms) {
    return (
      <div className="p-6 flex-col pt-24 min-h-screen items-center justify-center text-center">
        <div className="text-4xl">טוען חדרים</div>
        <div className="flex items-center justify-center">
          <Image
            src={"/flame-16245_256.gif"}
            width={200}
            height={200}
            alt="loading"
          />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const paginatedRooms = rooms.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-blue-100 pt-24 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8">🏨 רשימת החדרים</h1>

      <div className="max-w-7xl mx-auto grid gap-6">
        {paginatedRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4">
                <img
                  src={room.imageUrl}
                  alt={room.roomType}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              <div className="md:w-2/4 p-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {room.roomType}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Telescope className="w-5 h-5" />
                    <span>{room.view}</span>
                  </div>

                  {/* {room.availability === true && (
                    <div className="text-green-600 font-semibold">
                      זמין להזמנה
                    </div>
                  )} */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {room.airConditioning === true && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>מיזוג אוויר</span>
                      </div>
                    )}

                    {room.dailyCleaning === true && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>ניקיון יומי</span>
                      </div>
                    )}

                    {room.smokingAllowed === true && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>מותר לעשן</span>
                      </div>
                    )}

                    {room.petsAllowed === true && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>מותר חיות מחמד</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{room.bathroomType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <div>{room.bedType}</div>
                    </div>
                  </div>

                  <div className="text-lg">
                    <span>גודל החדר: {room.roomSize} מ"ר</span>
                  </div>

                  <div className="text-2xl font-bold text-blue-600">
                    ₪{room.price} ללילה
                  </div>
                </div>
              </div>

              <div className="md:w-1/4   p-6 flex items-center justify-center">
                <button
                  onClick={() => {
                    setLoadingRoomId(room._id);
                    router.push(`/bookRoom/${room._id}`);
                  }}
                  disabled={loadingRoomId === room._id}
                  className={clsx(
                    `w-full cursor-pointer bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2`,
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
          </div>
        ))}
      </div>

      {/* 🧭 כפתורי ניווט */}
      <div className="flex items-center justify-center gap-3 py-4 ">
        {/* לעמוד הראשון */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="text-xl cursor-pointer disabled:opacity-40"
        >
          <ChevronsRight color="#055ff0" />
        </button>

        {/* עמוד קודם */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-xl cursor-pointer disabled:opacity-40"
        >
          <ChevronRight color="#055ff0" />
        </button>

        {/* עמוד נוכחי מתוך כלל העמודים */}
        <span className="text-lg font-medium text-gray-800">
          עמוד {currentPage} מתוך {totalPages}
        </span>

        {/* עמוד הבא */}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="text-xl cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft color="#055ff0" />
        </button>

        {/* לעמוד האחרון */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="text-xl cursor-pointer disabled:opacity-40"
        >
          <ChevronsLeft color="#055ff0" />
        </button>
      </div>
    </div>
  );
}
