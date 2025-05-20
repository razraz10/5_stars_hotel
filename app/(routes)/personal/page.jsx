"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { BedDouble, BedIcon, Clock, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserProfile from "@/app/components/personal/UserProfile";
import Booking from "@/app/components/personal/Booking";
import axiosSelf from "@/app/lib/axiosInstance";
import BookingHistory from "@/app/components/personal/BookingHistory";

export default function page() {
  // אחרי עידכון עובר לדף הבית
  const router = useRouter();
  // פרופיל המשתמש
  const user = useAuthStore((state) => state.user);
  // פרופיל או הזמנות
  const [activeTab, setActiveTab] = useState("profile");
  const [bookedRooms, setBookedRooms] = useState([]);
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const getMyOrders = async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      toast.error("לא מחובר!");
      return;
    }

    try {
      const response = await axiosSelf.get("/rooms/myOrders");
      setBookedRooms(response.data);
    } catch (error) {
      toast.error("שגיאה בהבאת ההזמנות");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (user) {
      setEditUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        currentPassword: "",
        newPassword: "",
      });

      // טען את החדרים שהוזמנו
      getMyOrders();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosSelf.put(`/users/${user._id}`, editUser);
      useAuthStore.getState().updateUser({
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
      });

      toast.success("המשתמש עודכן בהצלחה");
      router.push("/home");
    } catch (err) {
      const message = err.response?.data?.message || "שגיאה בעדכון המשתמש";
      const errors = err.response?.data?.errors;
      toast.error(errors ? errors.join(", ") : message);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-blue-100  py-12" dir="rtl">
      <div className="max-w-5xl mx-auto p-4 bg-gray-50 rounded-2xl shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">האזור האישי</h1>
          <p className="text-gray-600 mt-2">נהל את הפרופיל וההזמנות שלך</p>
        </div>

        <div className=" overflow-hidden">
          {/* טאבים */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User size={18} />
              פרטי משתמש
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition ${
                activeTab === "bookings"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <BedDouble size={18} />
              הזמנות
            </button>
            <button
              onClick={() => setActiveTab("bookingsHistory")}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition ${
                activeTab === "bookingsHistory"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Clock size={18} />
              היסטוריית הזמנות
            </button>
          </div>

          {/* תוכן */}
          <div className="p-6">
            {activeTab === "profile" ? (
              <div className="max-w-2xl mx-auto">
                <UserProfile
                  editUser={editUser}
                  handleInputChange={handleInputChange}
                  handleSave={handleSave}
                />
              </div>
            ) : activeTab === "bookings" ?(
              <div>
                <Booking bookedRooms={bookedRooms} setBookedRooms={setBookedRooms} />
              </div>
            ):(
              <div>
                <BookingHistory bookedRooms={bookedRooms} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
