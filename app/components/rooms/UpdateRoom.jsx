"use client";
import { CircleX, Hotel, Loader2, PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import InputsAddRooms from "@/app/components/rooms/InputsAddRooms";
import axios from "axios";
import toast from "react-hot-toast";
import axiosSelf from "@/app/lib/axiosInstance";

export default function UpdateRoom({ setUpdateRoom, roomData }) {
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

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (roomData) {
      setFormData({
        roomId: roomData._id,
        roomNumber: roomData.roomNumber || "",
        roomType: roomData.roomType || "",
        price: roomData.price || "",
        view: roomData.view || "",
        floor: roomData.floor || "",
        maxOccupancy: roomData.maxOccupancy || "",
        roomSize: roomData.roomSize || "",
        bathroomType: roomData.bathroomType || "",
        bedType: roomData.bedType || "",
        airConditioning: roomData.airConditioning || "true",
        petsAllowed: roomData.petsAllowed || "false",
        smokingAllowed: roomData.smokingAllowed || "false",
        dailyCleaning: roomData.dailyCleaning || "true",
        availability: roomData.availability || "true",
        balcony: roomData.balcony || "false",
        active: roomData.active || "true",
        file: null, // Reset file input
      });
      setPreviewImage(roomData.imageUrl || null); // Set initial image preview if available
    }
  }, [roomData]);

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
    { name: "floor", label: "קומה", type: "number" },
    { name: "maxOccupancy", label: "מקסימום אנשים", type: "number" },
    { name: "roomSize", label: "מידת חדר", type: "number" },
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
      name: "airConditioning",
      label: "מיזוג אוויר",
      type: "select",
      options: [
        { value: "true", text: "יש" },
        { value: "false", text: "אין" },
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
      name: "availability",
      label: "זמינות",
      type: "select",
      options: [
        { value: "true", text: "זמין" },
        { value: "false", text: "לא זמין" },
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
  ];

  // השינויים
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // שינוי תמונה
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // שמירת השינויים
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
      const response = await axiosSelf.put("/rooms/addRoom", data);
      const result = response.data;

      if (!result) throw new Error(result.message || "שגיאה בהוספת החדר");

      toast.success("החדר עודכן בהצלחה");
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
      setUpdateRoom(false);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const response = axiosSelf.delete("/rooms/addRoom", {
        data: { roomId: formData.roomId },
      });
      setLoadingDelete(true)
      setUpdateRoom(false);
      toast.success("מחיקה בוצעה בהצלחה");
    } catch (error) {
      console.error(error);
      setLoadingDelete(false)
    }
  };

  const closeUpdateRoom = () => {
    toast("לא עדכנת חדר", {
      duration: 1500,
      icon: "😊",
    });
    setUpdateRoom(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <Hotel className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">עריכת חדר</h2>
          </div>
          <div
            className="flex justify-start cursor-pointer "
            onClick={closeUpdateRoom}
          >
            <CircleX className="text-red-500" size={30} />
          </div>
        </div>
      </div>
      {roomData.active === false && <div className="text-center text-red-600">כרגע החדר מחוק מהמערכת</div>}
      <div className="p-8">
        <form className="space-y-6" dir="rtl">
          <div className="">
            <InputsAddRooms
              formData={formData}
              handleChange={handleChange}
              fields={fields}
            />
          </div>

          {/* Image Upload */}
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

          {/* Preview Image */}
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="תצוגה מקדימה"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 w-full justify-around">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-2/3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>מעלה...</span>
                </>
              ) : (
                <>
                  {roomData.active === true ? (
                    <>
                      <span>עדכן חדר</span>
                      <PlusCircle size={20} />
                    </>
                  ) : (
                    <>
                      <span>שחזר חדר </span>
                      <PlusCircle size={20} />
                    </>
                  )}
                </>
              )}
            </button>
            {roomData.active === true ? (
              <button
                onClick={handleDeleteRoom}
                disabled={loadingDelete}
                className="w-1/3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <>
                  {loadingDelete ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>מוחק...</span>
                    </>
                  ) : (
                    <>
                      <span>מחק חדר</span>
                      <PlusCircle size={20} />
                    </>
                  )}
                </>
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
