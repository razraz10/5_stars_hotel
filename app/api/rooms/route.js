import { dbConnect } from "@/app/lib/db";
import Room from "@/app/models/Room";

// להביא את כל החדרים
export async function GET(req) {
  await dbConnect();

  try {
    const rooms = await Room.find({availability : true});
    return Response.json(rooms, { status: 200 });
  } catch (error) {
    return Response.json({ message: "שגיאה בטעינת חדרים" }, { status: 500 });
  }
}

