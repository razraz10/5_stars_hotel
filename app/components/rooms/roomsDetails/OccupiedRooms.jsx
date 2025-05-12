'use client'
import axiosSelf from '@/app/lib/axiosInstance';
import React, { useEffect, useState } from 'react'

export default function OccupiedRooms() {
    const [rooms, setRooms] = useState([]);

  const getOccupiedRooms = async () => {
    try {
      const response = await axiosSelf.get(`/rooms/occupiedRooms`);
      const data = response.data;
      // console.log(data,"hhhkh");
      
      // const filter = data.filter((room) => room.availability === true);
      setRooms(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOccupiedRooms();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ">
      <div className="text-gray-500 mb-2">  חדרים תפוסים</div>
      <div className="text-2xl font-bold mb-2">{rooms.length}</div>
    </div>
  );
}
