import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/db";

// טוקן רענון - טוקן שמאפשר למשתמש לקבל טוקן גישה חדש מבלי להיכנס מחדש
export async function GET(req) {
  await dbConnect();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) return Response.json({ message: "אין טוקן רענון" }, { status: 401 });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return Response.json({ message: "משתמש לא נמצא" }, { status: 404 });

    // מביא טוקן גישה חדש
    const newAccessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return Response.json({ token: newAccessToken, user }, { status: 200 });
  } catch (err) {
    return Response.json({ message: "טוקן לא תקין או פג תוקף" }, { status: 403 });
  }
}
