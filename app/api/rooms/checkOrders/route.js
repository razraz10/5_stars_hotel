import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import User from "@/app/models/User";

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("bookingNumber");

    const errorsOrder = [];
    if (!orderNumber) {
      return new Response(
        JSON.stringify({ message: "צריך להזין מספר הזמנה" }),
        {
          status: 400,
        }
      );
    }

    const order = await Booking.findOne({ bookingNumber: orderNumber })
      .populate("room")
      .populate("user");

    if (!order) {
      errorsOrder.push("לא נמצא הזמנה עם המספר הזה");
      return new Response(
        JSON.stringify({
          message: "לא נמצא הזמנה עם המספר הזה",
          errors: errorsOrder,
        }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "שגיאה בטעינת הזמנה" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }

  await dbConnect();

  try {
    const body = await req.json();

    const { bookingNumber, roomNumber, checkInDate, checkOutDate } = body;

    const missingFields = [];
    if (!bookingNumber) missingFields.push("חסר מספר הזמנה");
    if (!roomNumber) missingFields.push("חסר מספר חדר");
    if (!checkInDate) missingFields.push("חסר תאריך כניסה");
    if (!checkOutDate) missingFields.push("חסר תאריך יציאה");

    if (missingFields > 0) {
      return new Response(
        JSON.stringify({
          message: "חסרים נתונים נדרשים",
          errors: missingFields,
        }),
        {
          status: 400,
        }
      );
    }

    const order = await Booking.findOne({ bookingNumber });

    if (!order) {
      return new Response(JSON.stringify({ message: "הזמנה לא נמצאה" }), {
        status: 404,
      });
    }

    const isOwner = decoded.role === "user";
    const isAdmin = decoded.role === "admin";
    if (!isOwner && !isAdmin) {
      return new Response(
        JSON.stringify({ message: "אין הרשאה לעדכן את ההזמנה" }),
        {
          status: 403,
        }
      );
    }
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      return new Response(
        JSON.stringify({ message: "חסר מספר חדר/החדר לא נמצא" }),
        { status: 404 }
      );
    }

    const existingBooking = await Booking.findOne({
      _id: { $ne: order._id },
      room: room._id,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });

    if (existingBooking) {
      return new Response(
        JSON.stringify({ message: "החדר תפוס בתאריכים האלו" }),
        { status: 409 }
      );
    }

    order.room = room._id;
    order.checkInDate = new Date(checkInDate);
    order.checkOutDate = new Date(checkOutDate);
    order.updatedAt = new Date();

    await order.save();

    return new Response(JSON.stringify({ message: "ההזמנה עודכנה בהצלחה" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "שגיאה בטעינת הזמנה" }), {
      status: 500,
    });
  }
}
