import { ChevronDown } from "lucide-react";
import React from "react";

export default function DynamicForm({ formData, handleChange, fields }) {
  console.log(formData);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {fields.map(({ name, label, type, options }) => (
        <div key={name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {type === "select" ? (
            <div className="relative">
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full  px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none "
            ><option value="">בחר אפשרות</option>
              {options.map(({text, value }) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronDown className="text-blue-500" width={20} />
          </div>
          </div>
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border  [&::-webkit-inner-spin-button]:appearance-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          )}
        </div>
      ))}
    </div>
  );
}
