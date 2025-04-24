import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/db";

export async function GET(req) {
  await dbConnect();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) return Response.json({ message: "אין טוקן רענון" }, { status: 401 });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return Response.json({ message: "משתמש לא נמצא" }, { status: 404 });

    const newAccessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    return Response.json({ token: newAccessToken, user }, { status: 200 });
  } catch (err) {
    return Response.json({ message: "טוקן לא תקין או פג תוקף" }, { status: 403 });
  }
}
