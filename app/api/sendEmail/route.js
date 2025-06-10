import { NextResponse } from "next/server";
import { Resend } from "resend";
import EmailTemplate from "@/app/components/emailConfirm/EmailTemplate";
import { verifyToken } from "@/app/lib/auth/verifyToken";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // וידוא הטוקן
    const { decoded, error: tokenError } = verifyToken(req);
    if (tokenError) {
      console.error("Token verification failed:", tokenError);
      return NextResponse.json({ error: tokenError }, { status: 401 });
    }

    // קבלת נתוני ההזמנה
    const body = await req.json();
    
    console.log("Attempting to send email to:", decoded.email);

    // בדיקה אם המייל זהה למייל המאומת
    const authorizedEmail = "raziel1q2w3e@gmail.com";
const emailToUse = process.env.NODE_ENV === "development" ? authorizedEmail : decoded.email;
    const fromEmail = process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : "best-hotel-razraz.com"; // Replace with your verified emai
    const { data, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: emailToUse,
      subject: `אישור הזמנה - ${body.bookingNumber}`,
      react: EmailTemplate({
        firstName: body.firstName,
        lastName: body.lastName,
        bookingNumber: body.bookingNumber,
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        price: body.price,
        roomType: body.roomType,
        view: body.view,
        imageUrl: body.imageUrl
      })
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { 
          error: "שגיאה בשליחת אימייל",
          details: emailError.message,
          note: process.env.NODE_ENV === "development" ? 
            "במצב פיתוח, המיילים נשלחים רק לכתובת המאומתת" : 
            undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "אימייל נשלח בהצלחה",
      note: process.env.NODE_ENV === "development" ? 
        `במצב פיתוח, המייל נשלח ל-${authorizedEmail}` : 
        undefined
    }, { status: 200 });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "שגיאה בשרת", details: err.message },
      { status: 500 }
    );
  }
}