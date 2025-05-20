import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/db";

// טוקן רענון - טוקן שמאפשר למשתמש לקבל טוקן גישה חדש מבלי להיכנס מחדש
export async function GET(req) {
  await dbConnect();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return new Response(JSON.stringify({ message: "אין טוקן רענון" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return new Response(JSON.stringify({ message: "משתמש לא נמצא" }), {
        status: 404,
      });
    }

    // מביא טוקן גישה חדש
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // יצירת רענון טוקן חדש
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    return new Response(
      JSON.stringify({ 
        token: newAccessToken, 
        user: userWithoutPassword 
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        }
      }
    );
  } catch (err) {
    console.error("שגיאת רענון טוקן:", err);
    return Response.json(
      { message: "טוקן לא תקין או פג תוקף" },
      { status: 403 }
    );
  }
}
