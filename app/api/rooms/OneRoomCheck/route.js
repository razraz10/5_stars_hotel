import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import { act } from "react";

export async function GET(req) {
    await dbConnect();
  
    try {
      const { searchParams } = new URL(req.url);
      const checkInDate = new Date(searchParams.get("checkInDate"));
      const checkOutDate = new Date(searchParams.get("checkOutDate"));
      const roomNumber = searchParams.get("roomNumber");
  
      // בדיקה שהחדר קיים
      const room = await Room.findOne({
        roomNumber: roomNumber,
        active: true
      });
  
      if (!room) {
        return new Response(
          JSON.stringify({
            message: "החדר לא קיים במערכת או לא פעיל",
            errors: ["החדר המבוקש לא נמצא או לא זמין להזמנות"],
          }),
          { status: 404 }
        );
      }
  
      // בדיקת חפיפה בין תאריכים - תיקון השאילתה
      const existBooking = await Booking.find({
        room: room._id,
        isActive: true,
        isDeleted: false,
        $or: [
          // מקרה 1: הזמנה קיימת מכסה את התאריכים המבוקשים
          {
            checkInDate: { $lte: checkInDate },
            checkOutDate: { $gte: checkOutDate }
          },
          // מקרה 2: תאריך התחלה בתוך הזמנה קיימת
          {
            checkInDate: { $lte: checkInDate },
            checkOutDate: { $gt: checkInDate }
          },
          // מקרה 3: תאריך סיום בתוך הזמנה קיימת
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gte: checkOutDate }
          },
          // מקרה 4: התאריכים המבוקשים מכסים הזמנה קיימת
          {
            checkInDate: { $gte: checkInDate },
            checkOutDate: { $lte: checkOutDate }
          }
        ]
      });
  
      console.log("Debug info:", {
        requestedDates: {
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString()
        },
        roomId: room._id,
        roomNumber: roomNumber,
        foundBookings: existBooking
      });
  
      const isAvailable = existBooking.length === 0;
  
      return new Response(
        JSON.stringify({
          isAvailable,
          existBooking: existBooking.map(booking => ({
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            bookingNumber: booking.bookingNumber
          }))
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error checking availability:", error);
      return new Response(
        JSON.stringify({
          message: "שגיאה בבדיקת זמינות החדר",
          error: error.message
        }),
        { status: 500 }
      );
    }
  }
