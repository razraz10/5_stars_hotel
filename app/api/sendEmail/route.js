import { NextResponse } from "next/server";
import { Resend } from "resend";
import EmailTemplate from "@/app/components/emailConfirm/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      to,
      firstName,
      lastName,
      bookingNumber,
      checkInDate,
      checkOutDate,
      price,
      roomType,
      view,
      imageUrl,
    } = body;

    const { data, error } = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to,
      subject: "אישור הזמנה",
      react: EmailTemplate({
        to,
        firstName,
        lastName,
        bookingNumber,
        checkInDate,
        checkOutDate,
        price,
      roomType,
      view,
      imageUrl,
      }),
    });

    if (error) {
      console.error("שגיאה בשליחת אימייל:", error);
      return NextResponse.json(
        { error: "שגיאה בשליחת אימייל" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data, message: "אימייל נשלח בהצלחה" },
      { status: 200 }
    );
  } catch (err) {
    console.error("שגיאה:", err);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
