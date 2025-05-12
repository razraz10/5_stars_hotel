"use client";
import AddNewRoom from "@/app/components/rooms/AddNewRoom";
import UpdateRoom from "@/app/components/rooms/UpdateRoom";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Hotel,
  Users,
  PlusCircle,
  Search,
  Settings,
  LayoutDashboard,
  LogOut,
  Edit3,
  UserPlus,
  BedDouble,
  SearchCheck,
} from "lucide-react";
import AddNewManager from "@/app/components/rooms/AddNewManager";
import NumberOfRoom from "@/app/components/rooms/roomsDetails/NumberOfRoom";
import OccupiedRooms from "@/app/components/rooms/roomsDetails/OccupiedRooms";
import TodayOrders from "@/app/components/rooms/roomsDetails/TodayOrders";
import CheckOrders from "@/app/components/rooms/CheckOrders";
import axiosSelf from "@/app/lib/axiosInstance";

export default function page() {
  // פופאפ לחדר חדש
  const [addRoom, setAddRoom] = useState(false);
  // פופאפ לחדר חדש
  const [addManager, setAddManager] = useState(false);
  // המידע לעריכת חדר
  const [updateRoomData, setUpdateRoomData] = useState(null);
  // פופאפ לעריכת חדר
  const [updateRoom, setUpdateRoom] = useState(false);
  // מספר החדר לעריכה
  const [roomNumber, setRoomNumber] = useState("");
  // המידע להזמנה
  const [orderData, setOrderData] = useState(null);
  // פופאפ להזמנת חדר
  const [checkOrder, setCheckOrder] = useState(false);
  // מספר ההזמנה לבדיקה
  const [orderNumber, setOrderNumber] = useState("");

  // בודק אם הוא מנהל יש לו הראה לדף
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login"); // שולח לדף ההתחברות אם לא מחובר
    }
  }, [user, router]);

  // פופאפ לחדר חדש
  const handleAddRoomClick = () => {
    setAddRoom(true);
  };

  // פופאפ להוספת מנהל חדש
  const handleAddManagerClick = () => {
    setAddManager(true);
  };

  // פופאפ לחיפוש חדר
  const handleUpdateRoomClick = async () => {
    try {
      const response = await axiosSelf.get(
        `/rooms/addRoom?roomNumber=${roomNumber}`
      );
      const data = response.data;
      console.log(data);
      if (data.active === false) toast.error("החדר כרגע מחוק מהמערכת");
      setUpdateRoomData(data);
      setUpdateRoom(true);
      setRoomNumber("");
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

  // פופאפ לחיפוש הזמנה
  const handleOrderCheckClick = async () => {
    try {
      const response = await axiosSelf.get(
        `/rooms/checkOrders?bookingNumber=${orderNumber}`
      );
      const data = response.data;
      console.log(data);
      // if (data.active === false) toast.error("החדר כרגע מחוק מהמערכת");
      setOrderData(data);
      setCheckOrder(true);
      setOrderNumber("");
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

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-2xl font-bold">לוח בקרת מנהלים</h2>
            <div className="flex items-center gap-4">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="חיפוש..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div> */}
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={handleAddRoomClick}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition group"
            >
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                <PlusCircle size={24} />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">הוספת חדר חדש</h3>
                <p className="text-gray-500">הוסף חדר חדש למלון</p>
              </div>
            </button>

            <button
              onClick={handleAddManagerClick}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition group"
            >
              <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition">
                <UserPlus size={24} />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">הוספת מנהל</h3>
                <p className="text-gray-500">הוסף מנהל חדש למערכת</p>
              </div>
            </button>

            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Edit3 size={24} />
                </div>
                <h3 className="text-lg font-semibold">עריכת חדר</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="number"
                  className="w-full px-4 py-2 border text-right [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="מספר חדר לעריכה"
                  maxLength={8}
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
                <button
                  onClick={handleUpdateRoomClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  חיפוש
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <SearchCheck size={24} />
                </div>
                <h3 className="text-lg font-semibold">בדיקת הזמנות</h3>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full px-4 py-2 border text-right [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="מספר הזמנה לבדיקה"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
                <button
                  onClick={handleOrderCheckClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  חיפוש
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <NumberOfRoom />
            <OccupiedRooms />
            <TodayOrders />
            <NumberOfRoom />
            {/* {[
            { title: 'סך הכל חדרים', value: '50', change: '+2 החודש' },
            { title: 'חדרים תפוסים', value: '35', change: '70% תפוסה' },
            { title: 'הזמנות היום', value: '12', change: '+3 מאתמול' },
            { title: 'הכנסה חודשית', value: '₪85,000', change: '+15% מהחודש שעבר' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-gray-500 mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold mb-2">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          ))} */}
          </div>
        </main>
      </div>

      {addRoom && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <div className=" max-h-[90vh] no-scrollbar overflow-y-auto rounded-xl shadow-lg  w-full max-w-xl">
            <AddNewRoom setAddRoom={setAddRoom} />
          </div>
        </div>
      )}

      {addManager && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <AddNewManager setAddManager={setAddManager} />
        </div>
      )}

      {checkOrder && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <CheckOrders orderData={orderData} setCheckOrder={setCheckOrder} />
        </div>
      )}

      {updateRoom && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <div className=" max-h-[90vh] no-scrollbar overflow-y-auto rounded-xl shadow-lg  w-full max-w-xl">
            <UpdateRoom
              roomData={updateRoomData}
              setUpdateRoom={setUpdateRoom}
            />
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
