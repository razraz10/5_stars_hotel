import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const checkInDate = new Date(searchParams.get("checkInDate"));
    const checkOutDate = new Date(searchParams.get("checkOutDate"));

    // קבלת כל החדרים הפעילים
    const allRooms = await Room.find({
    //   isDeleted: false,
      active: true
    });

    // מצא את כל ההזמנות שחופפות לתאריכים המבוקשים
    const bookedRooms = await Booking.find({
        // room: allRooms._id,
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
      }).distinct('room');

    // סנן את החדרים התפוסים
    const availableRooms = allRooms.filter(room => 
      !bookedRooms.some(bookedRoom => 
        bookedRoom.toString() === room._id.toString()
      )
    );

    return new Response(
      JSON.stringify({
        availableRooms: availableRooms.map(room => ({
          _id: room._id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          roomType: room.roomType,
          price: room.price,
          view: room.view,
          imageUrl: room.imageUrl
        }))
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking available rooms:", error);
    return new Response(
      JSON.stringify({
        message: "שגיאה בבדיקת חדרים זמינים",
        error: error.message
      }),
      { status: 500 }
    );
  }
}