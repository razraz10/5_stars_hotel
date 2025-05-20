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
import OccupiedRooms from "@/app/components/rooms/roomsDetails/OccupiedRooms";
import TodayOrders from "@/app/components/rooms/roomsDetails/TodayOrders";
import CheckOrders from "@/app/components/rooms/CheckOrders";
import axiosSelf from "@/app/lib/axiosInstance";
import AddBtns from "@/app/components/admin/AddBtns";
import AdminSearchInputs from "@/app/components/admin/AdminSearchInputs";
import Income from "@/app/components/rooms/roomsDetails/Income";
import AmountOfRooms from "@/app/components/rooms/roomsDetails/AmountOfRooms";
import RoomAvailability from "@/app/components/rooms/roomsDetails/RoomAvailability";
import AllRoomsAvailability from "@/app/components/rooms/roomsDetails/AllRoomsAvailability";

export default function page() {
  // פופאפ לחדר חדש
  const [addRoom, setAddRoom] = useState(false);
  // פופאפ להופת משתמש/מנהל חדש
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
  // טעינת חדר
  const [loadingUpdateRoom, setLoadingUpdateRoom] = useState(false);
  // טעינת הזמנה
const [loadingOrderCheck, setLoadingOrderCheck] =useState(false);
  // מספר ההזמנה לבדיקה
  const [orderNumber, setOrderNumber] = useState("");

  // בודק אם הוא מנהל יש לו הרשאה לדף
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
  const handleAddManagerClick = (type) => {
    setAddManager(type);
  };

  // פופאפ לחיפוש חדר
  const handleUpdateRoomClick = async () => {
    try {
      setLoadingUpdateRoom(true);
      const response = await axiosSelf.get(
        `/rooms/addRoom?roomNumber=${roomNumber}`
      );
      const data = response.data;
      if (data.active === false) toast.error("החדר כרגע מחוק מהמערכת");
      setUpdateRoomData(data);
      setUpdateRoom(true);
      setRoomNumber("");
      setLoadingUpdateRoom(false);
    } catch (error) {
      setLoadingUpdateRoom(false);
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
      setLoadingOrderCheck(true);
      const response = await axiosSelf.get(
        `/rooms/checkOrders?bookingNumber=${orderNumber}`
      );
      const data = response.data;
      console.log(data);
      setOrderData(data);
      setCheckOrder(true);
      setOrderNumber("");
      setLoadingOrderCheck(false);
    } catch (error) {
      setLoadingOrderCheck(false);
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

  const buttons = [
    {
      onClick: () => handleAddManagerClick("manager"),
      icon: UserPlus,
      title: "הוספת מנהל",
      description: "הוסף מנהל חדש למערכת",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      hoverColor: "bg-green-600",
      hoverText: "text-white",
    },
    {
      onClick: () => handleAddManagerClick("user"),
      icon: UserPlus,
      title: "הוספת משתמש",
      description: "הוסף משתמש חדש למערכת",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      hoverColor: "bg-green-600",
      hoverText: "text-white",
    },
    {
      onClick: handleAddRoomClick,
      icon: PlusCircle,
      title: "הוספת חדר חדש",
      description: "הוסף חדר חדש למלון",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      hoverColor: "bg-blue-600",
      hoverText: "text-white",
    },
  ];

  const cards = [
    {
      icon: Edit3,
      title: "עריכת חדר",
      placeholder: "מספר חדר לעריכה",
      inputType: "number",
      value: roomNumber,
      onChange: (e) => setRoomNumber(e.target.value),
      onClick: handleUpdateRoomClick,
      loading: loadingUpdateRoom,
    },
    {
      icon: SearchCheck,
      title: "בדיקת הזמנות",
      placeholder: "מספר הזמנה לבדיקה",
      inputType: "text",
      value: orderNumber,
      onChange: (e) => setOrderNumber(e.target.value),
      onClick: handleOrderCheckClick,
      loading: loadingOrderCheck,
    },
  ];

  return (
    <div className="flex min-h-screen pt-20 bg-blue-100" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-yellow-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-2xl font-bold">לוח בקרת מנהלים</h2>
          </div>
        </header>

        <main className="p-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* הוספת מנהל, הוספת משתמש, הוספת חדר */}
            {buttons.map((button, index) => (
              <AddBtns
                key={index}
                onClick={button.onClick}
                icon={button.icon}
                title={button.title}
                description={button.description}
                bgColor={button.bgColor}
                textColor={button.textColor}
                hoverColor={button.hoverColor}
                hoverText={button.hoverText}
              />
            ))}

            {/* עריכת חדר, בדיקת הזמנות */}
            {cards.map((card, index) => (
              <AdminSearchInputs
                key={index}
                icon={card.icon}
                title={card.title}
                placeholder={card.placeholder}
                inputType={card.inputType}
                value={card.value}
                onChange={card.onChange}
                onClick={card.onClick}
                loading={card.loading}
              />
            ))}
          </div>

            <RoomAvailability/>

            <AllRoomsAvailability/>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6">
            {/* מספר חדרים */}
            <AmountOfRooms />
            {/* כמה חדרים תפוסים בתאריכים מסוימים */}
            <OccupiedRooms />
            {/* הזמנות היום */}
            <TodayOrders />
            {/* הכנסה חודשית */}
            {/* <Income /> */}
            
          </div>
          
           
            {/* הכנסה חודשית */}
            <Income />
            
         
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
          <AddNewManager setAddManager={setAddManager} type={addManager} />
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
