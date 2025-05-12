import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";

// להביא את כל החדרים המוזמנים
export async function GET() {
  await dbConnect();

  try {
    const now = new Date();

    // שליפה של הזמנות פעילות שעדיין בתוקף
    const activeBookings = await Booking.find({
      isActive: true,
      isDeleted: false,
      checkOutDate: { $gte: now },
    }).populate("room");

    // שליפה רק של החדרים מתוך ההזמנות הפעילות
    const bookedRooms = activeBookings
      .map((booking) => booking.room)
      .filter(Boolean); // מסנן מקרים שבהם החדר לא נמצא

    return new Response(JSON.stringify(bookedRooms), { status: 200 });
  } catch (err) {
    console.error("Error getting booked rooms:", err);
    return new Response(
      JSON.stringify({ message: "שגיאה בשליפת חדרים מוזמנים", error: err.message }),
      { status: 500 }
    );
  }
}
