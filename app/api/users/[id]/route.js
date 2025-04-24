import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params;

 const { decoded, error, status } = verifyToken(req);

  if (error) {
    return new Response(JSON.stringify({ message: error }), {
      status,
    });
  }

  if (!decoded || (decoded.role !== 'admin' && decoded.userId !== id)) {
    return new Response(JSON.stringify({ message: "אין לך הרשאות לבצע פעולה זו" }), { status: 403 });
  }

  
  try {
    const body = await req.json();

    const { firstName, lastName, email, currentPassword, newPassword } = body;

    const errors = [];

    if (!firstName || !lastName || !email) {
      if (!firstName) errors.push("שם פרטי חסר");
      if (!lastName) errors.push("שם משפחה חסר");
      if (!email) errors.push("אימייל חסר");
      return new Response(
        JSON.stringify({ message: "חסרים שדות חובה", errors: errors }),
        {
          status: 400,
        }
      );
    }

    if (newPassword && !currentPassword) {
      errors.push("עליך להזין את הסיסמה הנוכחית כדי לשנות סיסמה");
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return new Response(JSON.stringify({ message: "המשתמש לא נמצא" }), {
        status: 404,
      });
    }

    // בדיקת אימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("אימייל לא תקין");
      return new Response(JSON.stringify({ message: "אימייל לא תקין" }), {
        status: 400,
      });
    }
    

    // בדיקת סיסמה
    const passwordRegex = /^\d{8}$/;
   

    let updatedFields = {
      firstName,
      lastName,
      email,
    };

    if (newPassword) { 
      if (!passwordRegex.test(newPassword)) {
      errors.push("הסיסמה חייבת להכיל בדיוק 8 ספרות");
      return new Response(
        JSON.stringify({ message: "הסיסמה חייבת להכיל בדיוק 8 ספרות" }),
        { status: 400 }
      );
    }
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return new Response(
          JSON.stringify({ message: "הסיסמה הנוכחית שגויה" }),
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("שגיאה בעדכון המשתמש:", error);
    return new Response(JSON.stringify({ message: "שגיאה בעדכון המשתמש" }), {
      status: 500,
    });
  }
}
