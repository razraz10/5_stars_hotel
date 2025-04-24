'use client'
import axiosSelf from '@/app/lib/axiosInstance';
import React, { useEffect, useState } from 'react'

export default function TodayOrders() {
    const [rooms, setRooms] = useState([]);
  const getTodayOrders = async () => {
    try {
      const response = await axiosSelf.get(`/rooms`);
    //   console.log(response);
      const data = response.data;
      const filter = data.filter((room) => room.availability === false);
      setRooms(filter);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getTodayOrders();
  }, []);
//   console.log(rooms);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-gray-500 mb-2">  חדרים שהוזמנו היום</div>
      <div className="text-2xl font-bold mb-2">{rooms.length}</div>
    </div>
  );
}
