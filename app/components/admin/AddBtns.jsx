"use client";
import React from "react";

export default function AddBtns({ onClick, icon: Icon, title, description, bgColor, textColor, hoverColor, hoverText }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center cursor-pointer gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition group"
    >
      <div
        className={`p-3 ${bgColor} ${textColor} rounded-lg hover:${hoverColor} hover:${hoverText}  transition`}
      >
        <Icon size={24} />
      </div>
      <div className="text-right">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </button>
  );
}