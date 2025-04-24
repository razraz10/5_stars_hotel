"use client";
import InputsAddRooms from "@/app/components/rooms/InputsAddRooms";
import axiosSelf from "@/app/lib/axiosInstance";
import axios from "axios";
import { CircleX, Hotel, Loader2, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddNewRoom({ setAddRoom }) {
  // השדות להוספת חדר
  const fields = [
    { name: "roomNumber", label: "מספר חדר", type: "number" },
    {
      name: "roomType",
      label: "סוג חדר",
      type: "select",
      options: [
        { value: "סוויטה", text: "סוויטה" },
        { value: "רגיל", text: "רגיל" },
        { value: "דלוקס", text: "דלוקס" },
      ],
    },
    { name: "price", label: "מחיר ללילה", type: "number" },
    {
      name: "view",
      label: "תצפית (נוף)",
      type: "select",
      options: [
        { value: "ים", text: "ים" },
        { value: "עיר", text: "עיר" },
        { value: "בריכה", text: "בריכה" },
      ],
    },
    {
      name: "availability",
      label: "זמינות",
      type: "select",
      options: [
        { value: "true", text: "זמין" },
        { value: "false", text: "לא זמין" },
      ],
    },
    {
      name: "bathroomType",
      label: "סוג מקלחת",
      type: "select",
      options: [
        { value: "אמבטיה/מקלחת", text: "אמבטיה/מקלחת" },
        { value: "אמבטיה", text: "אמבטיה" },
        { value: "מקלחת", text: "מקלחת" },
      ],
    },
    {
      name: "bedType",
      label: "סוג מיטה",
      type: "select",
      options: [
        { value: "מיטת יחיד", text: "מיטת יחיד" },
        { value: "מיטה זוגית", text: "מיטה זוגית" },
      ],
    },
    {
      name: "petsAllowed",
      label: "חיות מחמד",
      type: "select",
      options: [
        { value: "false", text: "אסור" },
        { value: "true", text: "מותר" },
      ],
    },
    {
      name: "smokingAllowed",
      label: "עישון",
      type: "select",
      options: [
        { value: "false", text: "אסור" },
        { value: "true", text: "מותר" },
      ],
    },
    {
      name: "dailyCleaning",
      label: "ניקיון יומי",
      type: "select",
      options: [
        { value: "true", text: "יש" },
        { value: "false", text: "אין" },
      ],
    },
    {
      name: "airConditioning",
      label: "מיזוג אוויר",
      type: "select",
      options: [
        { value: "true", text: "יש" },
        { value: "false", text: "אין" },
      ],
    },
    {
      name: "balcony",
      label: "מרפסת",
      type: "select",
      options: [
        { value: "false", text: "אין" },
        { value: "true", text: "יש" },
      ],
    },
    { name: "floor", label: "קומה", type: "number" },
    { name: "maxOccupancy", label: "מקסימום אנשים", type: "number" },
    { name: "roomSize", label: "מידת חדר", type: "number" },
  ];

  // הטופס להוספת חדר
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    view: "",
    floor: "",
    maxOccupancy: "",
    roomSize: "",
    bathroomType: "",
    bedType: "",
    airConditioning: "true",
    petsAllowed: "false",
    smokingAllowed: "false",
    dailyCleaning: "true",
    availability: "true",
    balcony: "false",
    active: "true",
    file: null,
  });

  // מראה את התמונה לפני שמעלים אותה
  const [previewImage, setPreviewImage] = useState(null);
  // כשזה נטען
  const [loading, setLoading] = useState(false);

  // כל השדות של החדר
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // העלאת תמונה והצגת תצוגה מקדימה
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // הבקשה
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosSelf.post("/rooms/addRoom", data);

      const result = response.data;

      if (!response) throw new Error(result.message || "שגיאה בהוספת החדר");

      toast.success("החדר נוסף בהצלחה!");
      setFormData({
        roomNumber: "",
        roomType: "",
        price: "",
        view: "",
        floor: "",
        maxOccupancy: "",
        roomSize: "",
        bathroomType: "",
        bedType: "",
        airConditioning: "true",
        petsAllowed: "false",
        smokingAllowed: "false",
        dailyCleaning: "true",
        availability: "true",
        balcony: "false",
        active: "true",
        file: null,
      });
      setPreviewImage(null);
      setAddRoom(false);
      setLoading(false);
    } catch (error) {
      if (error.response) {
        // console.log(error);
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
      setLoading(false);
    }
  };

  const closeAddRoom = () => {
    toast("לא הוספת חדר", {
      duration: 1500,
      icon: "😱",
    });
    setAddRoom(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <Hotel className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">הוספת חדר חדש</h2>
          </div>
          <div
            className="flex justify-start cursor-pointer "
            onClick={closeAddRoom}
          >
            <CircleX className="text-red-500" size={30} />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <form className="space-y-6" dir="rtl">
          <div className="">
            <InputsAddRooms
              formData={formData}
              handleChange={handleChange}
              fields={fields}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              תמונת החדר
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    {previewImage ? (
                      <span>שנה תמונה</span>
                    ) : (
                      <span>העלה תמונה</span>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pr-1">או גרור לכאן</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG עד 10MB</p>
              </div>
            </div>
          </div>

          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="תצוגה מקדימה"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>מעלה...</span>
              </>
            ) : (
              <>
                <span>הוסף חדר</span>
                <PlusCircle size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
