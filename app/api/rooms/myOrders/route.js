import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import { verifyToken } from "@/app/lib/auth/verifyToken";

export async function GET(req) {
  await dbConnect();

  try {
    const { decoded, error, status } = verifyToken(req);
    if (error) {
      return new Response(JSON.stringify({ message: error }), { status });
    }

    const userId = decoded.userId; 
    const now = new Date();

    await Booking.updateMany(
      {
        checkOutDate: { $lt: now },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    );
    const bookings = await Booking.find({
      user: userId,
      isDeleted: false,
      // checkOutDate: { $gte: now } // לדאוג של הזמנה היא פעילה והסיום לא עבר
    }).populate("room").populate("user");

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (err) {
    console.error("JWT Error:", err);
    return new Response(
      JSON.stringify({ message: "שגיאה ב-token", error: err.message }),
      { status: 401 }
    );
  }
}

