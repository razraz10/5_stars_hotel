import { dbConnect } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// רישום משתמש חדש
export async function POST(req) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role } = await req.json();
    // קריאה לטוקן מה-Headers:
    const tokenCheck = req.headers.get("authorization")?.split(" ")[1];
    // console.log(tokenCheck);
    
    // בדיקת אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ message: "אימייל לא תקין" }), { status: 400 });
    }

    // בדיקת סיסמה
    const passwordRegex = /^\d{8}$/;
    if (!passwordRegex.test(password)) {
      return new Response(JSON.stringify({ message: "הסיסמה חייבת להכיל בדיוק 8 ספרות" }), { status: 400 });
    }

    // אם אימייל קיים כבר
    const existEmail = await User.findOne({email})
    if(existEmail){
        return new Response(JSON.stringify({message: 'האימייל כבר קיים במערכת'}),{status: 400})
    }

    // רק אם הוא מנהל הוא יכול להוסיף מנהלים אחרים
    if (role === "admin") {
      if (!tokenCheck) {
        return new Response(JSON.stringify({ message: "אינך מחובר" }), { status: 401 });
      }
      
      let decoded;
      try {
        decoded = jwt.verify(tokenCheck, process.env.JWT_SECRET);
      } catch (err) {
        return new Response(JSON.stringify({ message: "טוקן לא תקין" }), { status: 401 });
      }
      
      const adminUser = await User.findById(decoded.userId);
      if (!adminUser || adminUser.role !== "admin") {
        return new Response(JSON.stringify({ message: "אין לך הרשאה ליצור משתמשים" }), { status: 403 });
      }
    }

    // מסתיר סיסמה
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'user'
    })

    // יצירת טוקן למשתמש החדש
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // החזרת המשתמש והטוקן
    const userWithoutPassword = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role
    };

    return new Response(
      JSON.stringify({ 
        user: userWithoutPassword, 
        token 
      }), 
      { status: 201 }
    );
  } catch (error) {
    return new Response(
        JSON.stringify({ message: "שגיאה ביצירת משתמש", error: error.message }),
        { status: 500 }
      );
  }
}
