"use client";
import axiosSelf from "@/app/lib/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { CircleX, Hotel } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddNewManager({ setAddManager, type }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: type === "manager" ? "admin" : "user",
  });

  const [loading, setLoading] = useState(false);

  // const token = useAuthStore((state) => state.token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosSelf.post("/auth/register", formData);
      console.log(formData);

      toast.success(` הוספת ${type === "manager" ? "מנהל" : "משתמש"} בהצלחה `);
      setAddManager(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "שגיאה בעת הוספה ");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <Hotel className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">{`הוספת ${type === "manager" ? "מנהל" : "משתמש"} חדש `}</h2>
          </div>
          <div
            className="flex justify-start cursor-pointer "
            onClick={() => setAddManager(false)}
          >
            <CircleX className="text-red-500" size={30} />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="שם פרטי"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="שם משפחה"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            className="p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה (8 ספרות בלבד)"
            className="p-2 border rounded"
            onChange={handleChange}
            pattern="\d{8}"
            required
          />
          <button
            onClick={handleAddManager}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading
              ? "טוען..."
              : type === "manager"
                ? "הוסף מנהל"
                : "הוסף משתמש"}
          </button>
        </form>
      </div>
    </div>
  );
}
