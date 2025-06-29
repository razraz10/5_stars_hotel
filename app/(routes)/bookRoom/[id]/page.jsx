"use client";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  Bed,
  Bath,
  Maximize,
  Calendar,
  CreditCard,
  Check,
  Telescope,
  X,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import axiosSelf from "@/app/lib/axiosInstance";
import GooglePayButton from "@google-pay/button-react";

export default function page() {
  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const [isRoomAvailable, setIsRoomAvailable] = useState(false);

  const user = useAuthStore((state) => state.user);
  // console.log(user);
  const router = useRouter();

  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchRoom = async () => {
    const response = await axiosSelf.get(`/roomId/${id}`);
    const data = response.data;
    setRoom(data);
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
    if (user) {
      fetchRoom();
    }
  }, [id]);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0; // אם אין תאריכים, המחיר הוא 0
    const oneDay = 24 * 60 * 60 * 1000; // מספר המילישניות ביום
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay) +1); // חישוב מספר הימים
    return diffDays * room.price; // הכפלת מספר הימים במחיר ללילה
  };

  const handleCheckRooms = async () => {
    if (!startDate && !endDate) {
      toast.error("יש לבחור תאריכים להזמנה");
      return;
    }
    if (!startDate) {
      toast.error("יש לבחור תאריך התחלה להזמנה");
      return;
    }
    if (!endDate) {
      toast.error("יש לבחור תאריך סיום להזמנה");
      return;
    }
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      setLoadingCheck(true);
      const checkInDate = startDate;
      const checkOutDate = endDate;
      
      await axiosSelf.post(`/rooms/${id}`, {
        userId: user._id,
        roomId: room.id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        timeZone,
      });
      toast.success("לשמחתינו החדר פנוי בתאריכים האלה");
      setIsRoomAvailable(true);
    } catch (error) {
      setLoadingCheck(false);
      console.error(error);
      toast.error(error?.response?.data?.message || "שגיאה בהזמנה");
    }
  };

  const handleReservation = async () => {
    if (!startDate && !endDate) {
      toast.error("יש לבחור תאריכים להזמנה");
      return;
    }
    if (!startDate) {
      toast.error("יש לבחור תאריך התחלה להזמנה");
      return;
    }
    if (!endDate) {
      toast.error("יש לבחור תאריך סיום להזמנה");
      return;
    }
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      setLoading(true);
      const checkInDate = startDate;
      const checkOutDate = endDate;
      // חישוב מספר הימים והמחיר הכולל
      const oneDay = 24 * 60 * 60 * 1000; // מספר המילישניות ביום
      const diffDays = Math.round(
        Math.abs((checkOutDate - checkInDate) / oneDay) +1
      ); 
      // חישוב מספר הימים
      const totalPrice = diffDays * room.price; // חישוב המחיר הכולל
      const savedBooking = await axiosSelf.post(`/roomId/${id}`, {
        userId: user._id,
        roomId: room.id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice: totalPrice,
        timeZone,
      });
      await axiosSelf.post(`/sendEmail`, {
        to: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bookingNumber: savedBooking.data.bookingNumber,
        checkInDate: savedBooking.data.checkInDate,
        checkOutDate: savedBooking.data.checkOutDate,
        price: totalPrice,
        roomType: room.roomType,
        view: room.view,
        imageUrl: room.imageUrl,
      });

      localStorage.setItem("orderConfirmed", "true");
      router.push("/finishedOrder");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "שגיאה בהזמנה");
      setLoading(false);
    }
    // שלח בקשת הזמנה לשרת עם התאריכים
    console.log("הזמנה:", {
      startDate,
      endDate,
      roomId: id,
      userId: user?._id,
    });
  };

  if (!room) {
    return (
      <div className="p-6 flex-col pt-24 min-h-screen items-center justify-center text-center">
        <div className="text-4xl">טוען חדר</div>
        <div className="flex items-center justify-center">
          <Image
            src={"/flame-16245_256.gif"}
            width={200}
            height={200}
            alt="loading"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-blue-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative h-[500px] lg:h-full">
              <img
                src={
                  room?.imageUrl ||
                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80"
                }
                alt={room?.roomType}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* {room?.availability && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  זמין להזמנה
                </div>
              )} */}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {room?.roomType}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Telescope className="w-5 h-5" />
                  <span>{room?.view}</span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {room?.description}
                </p>
              </div>

              {/* Room Features */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">מאפייני החדר</h2>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-blue-600" />
                    <span>{room?.bedType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-5 h-5 text-blue-600" />
                    <span>{room?.bathroomType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize className="w-5 h-5 text-blue-600" />
                    <span>{room?.roomSize} מ"ר</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Telescope className="w-5 h-5 text-blue-600" />
                    <span>{room?.view}</span>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { condition: room?.airConditioning, label: "מיזוג אוויר" },
                    { condition: room?.dailyCleaning, label: "ניקיון יומי" },
                    { condition: room?.smokingAllowed, label: "עישון" },
                    { condition: room?.petsAllowed, label: "חיות מחמד" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {feature.condition ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Section */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">₪{room?.price}</span>
                  <span className="text-gray-600">/ ללילה</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">בחר תאריכים</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        צ'ק-אין
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          if (endDate && date > endDate) setEndDate(null);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="בחר תאריך"
                        showPopperArrow={false}
                        // className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        צ'ק-אאוט
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="בחר תאריך"
                        showPopperArrow={false}
                        // className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {/* סה"כ המחיר */}
                  {startDate && endDate && (
                    <div className="text-lg font-semibold text-gray-700">
                      סה"כ לתאריכים שנבחרו: ₪{calculateTotalPrice()}
                    </div>
                  )}
                  {isRoomAvailable ? (
                    <>
                      <div className="mt-6 flex justify-center">
                        <GooglePayButton
                          environment="TEST"
                          paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                              {
                                type: "CARD",
                                parameters: {
                                  allowedAuthMethods: [
                                    "PAN_ONLY",
                                    "CRYPTOGRAM_3DS",
                                  ],
                                  allowedCardNetworks: ["VISA", "MASTERCARD"],
                                },
                                tokenizationSpecification: {
                                  type: "PAYMENT_GATEWAY",
                                  parameters: {
                                    gateway: "example", // סתם לצורך בדיקה
                                    gatewayMerchantId: "exampleMerchantId",
                                  },
                                },
                              },
                            ],
                            merchantInfo: {
                              merchantName: "רזרז בדיקה",
                            },
                            transactionInfo: {
                              totalPriceStatus: "FINAL",
                              totalPriceLabel: "סה״כ",
                              totalPrice: `${room.price.toFixed(2)}`,
                              currencyCode: "ILS",
                              countryCode: "IL",
                            },
                          }}
                          onLoadPaymentData={(paymentData) => {
                            console.log("נתוני תשלום שהתקבלו:", paymentData);
                            alert("תשלום בוצע (לצורכי בדיקה בלבד)");
                          }}
                          buttonColor="black"
                          buttonType="buy"
                        />
                      </div>
                      <button
                        onClick={handleReservation}
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 mt-4"
                      >
                        {loading ? "מזמין..." : "הזמן עכשיו"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCheckRooms}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 mt-4"
                    >
                      {loadingCheck ? (
                        <span className="flex items-center justify-center gap-2">
                          בודק לך...
                          <Image
                            src={"/waiting-7579_256.gif"}
                            width={30}
                            height={30}
                            alt="wait"
                          />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          בדוק זמינות
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/flame-16245_256.gif"
              width={100}
              height={100}
              alt="loading"
            />
            <p className="text-lg font-semibold text-gray-700">
              שולח בקשת הזמנה אנא להמתין בעת שאנחנו מעבדים את הנתונים...
            </p>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
