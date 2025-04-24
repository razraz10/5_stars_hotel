import { dbConnect } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "המשתמש לא נמצא" }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return Response.json({ message: "סיסמה לא נכונה" }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ user, token: token }), {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/api/auth/refresh; Max-Age=604800; SameSite=Strict`,
      },
    });
  } catch (error) {
    return Response.json(
      { message: "שגיאה בהתחברות", error: error.message },
      { status: 500 }
    );
  }
}
