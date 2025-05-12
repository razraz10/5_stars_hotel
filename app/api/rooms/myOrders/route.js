import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import { verifyToken } from "@/app/lib/auth/verifyToken";

// להביא את כל ההזמנות של משתמש מסויים
// ולבדוק אם ההזמנה פעילה או לא (אם התאריך של הצ'ק אאוט עבר אז ההזמנה לא פעילה)
export async function GET(req) {
  await dbConnect();

  try {
    const { decoded, error, status } = verifyToken(req);
    if (error) {
      return new Response(JSON.stringify({ message: error }), { status });
    }

    const userId = decoded.userId; 
    const now = new Date();

    //  האם ההזמנה פעילה או לא (אם התאריך של הצ'ק אאוט עבר אז ההזמנה לא פעילה)
    //  אם התאריך עבר אז היא תתעדכן כלא פעילה
    await Booking.updateMany(
      {
        checkOutDate: { $lt: now },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    );
    // שליפת ההזמנות של המשתמש שלא נמחקו ולא עברו תאריך צ'ק אאוט
    const bookings = await Booking.find({
      user: userId,
      isDeleted: false,
      // checkOutDate: { $gte: now } 
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

