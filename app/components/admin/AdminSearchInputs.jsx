"use client";
import Image from "next/image";
import React from "react";

export default function AdminSearchInputs({
  icon: Icon,
  title,
  placeholder,
  inputType = "text",
  value,
  onChange,
  onClick,
  loading
}) {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-purple-100 rounded-xl shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        <input
          type={inputType}
          className="w-full px-4 py-2 border text-right [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          onClick={onClick}
          className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 rounded-lg font-semibold transition"
        >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                מחפש
                <Image src={'/waiting-7579_256.gif'} width={20} height={20} alt="wait" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                
                חיפוש
              </span>
            )}
            
        </button>
      </div>
    </div>
  );
}