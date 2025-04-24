import axiosSelf from "@/app/lib/axiosInstance";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function NumberOfRoom() {
  const [rooms, setRooms] = useState([]);
  const getRooms = async () => {
    try {
      const response = await axiosSelf.get(`/rooms`);
    //   console.log(response);
      const data = response.data;
      const filter = data.filter((room) => room.active === true);
      setRooms(filter);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getRooms();
  }, []);
//   console.log(rooms);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-gray-500 mb-2">סך הכל חדרים</div>
      <div className="text-2xl font-bold mb-2">{rooms.length}</div>
    </div>
  );
}
