import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Counter from "@/app/models/Counter";
import Room from "@/app/models/Room";
import  {fromZonedTime }  from 'date-fns-tz';

//  id-להביא חדר ספציפי לפי ה 
export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params;

  try {
    const room = await Room.findById(id);

    if (!room) {
      return new Response(JSON.stringify({ message: "לא נמצא חדר כזה" }), {
        status: 404,
      });
    }

    return Response.json(room, { status: 200 });
  } catch (error) {
    return Response.json({ message: "שגיאה בטעינת חדר" }, { status: 500 });
  }
}

// להזמין חדר
export async function POST(req, { params }) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }

  const { id: roomId } = params;

  const body = await req.json();
  const { checkInDate, checkOutDate, totalPrice, timeZone } = body;

  const userId = decoded.userId;

  try {
    // האם התאריכים של ההזמנה עברו כבר
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // const checkIn = new Date(checkInDate);
    // const checkOut = new Date(checkOutDate);
  const checkIn = fromZonedTime(checkInDate, timeZone);
const checkOut = fromZonedTime(checkOutDate, timeZone);
    if (checkIn < today || checkOut < today) {
      missingFields.push("התאריכים עברו כבר");
      return new Response(
        JSON.stringify({
          message: "לא ניתן להזמין תאריכים שעברו",
        }),
        { status: 400 }
      );
    }

    // בודק האם אפשר להזמין את החדר בתאריכים האלו
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

    // עושה מספר הזמנה
    const counter = await Counter.findOneAndUpdate(
      { name: "booking" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const currentYear = new Date().getFullYear();
    const formattedBookingNumber = `BK-${currentYear}-${counter.seq
      .toString()
      .padStart(4, "0")}`;

      // הזמנת החדר
    const newBooking = new Booking({
      bookingNumber: formattedBookingNumber,
      user: userId,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    const savedBooking = await newBooking.save();
    const plainBooking = savedBooking.toObject();

    return new Response(JSON.stringify(plainBooking), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "שגיאה ביצירת הזמנת חדר",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
