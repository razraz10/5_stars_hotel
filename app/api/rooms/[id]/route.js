import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import { fromZonedTime } from "date-fns-tz";

// בודק אם החדר פנוי בתאריכים שהמשתמש רוצה להזמין
export async function POST(req, { params }) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }

  const { id: roomId } = params;

  const body = await req.json();
  const { checkInDate, checkOutDate, timeZone } = body;

  // console.log(decoded);
  const userId = decoded.userId;
  try {
    const now = new Date();
    const nowInZone = fromZonedTime(now, timeZone);
    nowInZone.setHours(0, 0, 0, 0);

    // const checkIn = new Date(checkInDate);
    // const checkOut = new Date(checkOutDate);
    //       const checkIn = fromZonedTime(checkInDate, timeZone);
    // const checkOut = fromZonedTime(checkOutDate, timeZone);

    if (checkInDate < now || checkOutDate < now) {
      // missingFields.push("התאריכים עברו כבר");
      return new Response(
        JSON.stringify({
          message: "לא ניתן להזמין תאריכים שעברו",
        }),
        { status: 400 }
      );
    }

    const overlappingBooking = await Booking.findOne({
      room: roomId,
      isActive: true,
      isDeleted: false,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });

    if (overlappingBooking) {
      return new Response(
        JSON.stringify({ message: "החדר כבר מוזמן בתאריכים האלו" }),
        {
          status: 400,
        }
      );
    }
    return new Response(
      { message: "יש תאריכים פנויים לחדר זה" },
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "שגיאה בבדיקת זמינות חדר",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
