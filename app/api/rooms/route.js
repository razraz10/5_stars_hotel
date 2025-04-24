import { dbConnect } from "@/app/lib/db";
import Room from "@/app/models/Room";



export async function GET(req) {
    await dbConnect()

        try {
            const rooms = await Room.find({})
            return Response.json(rooms, {status: 200}) 
        } catch (error) {
            return Response.json({ message: "שגיאה בטעינת חדרים" }, {status: 500});
        }
}

