import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";

// להביא את כל החדרים
export async function GET(req) {
  await dbConnect();
  
    const { decoded, error, status } = verifyToken(req);
    if (error) {
      return new Response(JSON.stringify({ message: error }), { status });
    }

  try {
     // קבלת התאריך של היום
     const today = new Date();
     today.setHours(0, 0, 0, 0); // איפוס השעה לתחילת היום
 
     const tomorrow = new Date(today);
     tomorrow.setDate(today.getDate() + 1); // היום הבא

    const bookings = await Booking.find({
      createdAt: { $gte: today, $lt: tomorrow },
      isDeleted: false, // רק הזמנות פעילות
    })
    return Response.json(bookings, { status: 200 });
  } catch (error) {
    return Response.json({ message: "שגיאה בטעינת חדרים" }, { status: 500 });
  }
}
