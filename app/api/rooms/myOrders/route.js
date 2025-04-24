import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import { verifyToken } from "@/app/lib/auth/verifyToken";

export async function GET(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), {
      status,
    });
  }

  try {
    const userId = decoded.userId; 

    const bookings = await Booking.find({ user: userId }).populate("room");
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (err) {
    console.error("JWT Error:", err);
    return new Response(
      JSON.stringify({ message: "שגיאה ב-token", error: err.message }),
      { status: 401 }
    );
  }
}

