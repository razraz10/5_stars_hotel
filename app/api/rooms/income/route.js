import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Booking from "@/app/models/Booking";

export async function GET(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }

  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const monthlyBookings = await Booking.find({
      createdAt: { $gte: firstDayOfMonth, $lte: today },
      isDeleted: false,
      status: "completed",
    });

    const monthlyIncome = monthlyBookings.reduce(
      (acc, booking) => acc + Number(booking.totalPrice),
      0
    );

    const yearlyBookings = await Booking.find({
      createdAt: { $gte: firstDayOfYear, $lte: today },
      isDeleted: false,
      status: "completed",
    });
    const yearlyIncome = yearlyBookings.reduce(
      (acc, booking) => acc + Number(booking.totalPrice),
      0
    );

    const allBookings = await Booking.find({
      isDeleted: false,
      status: "completed",
    });

    const allIncome = allBookings.reduce(
      (acc, booking) => acc + Number(booking.totalPrice),
      0
    );

    return new Response(
      JSON.stringify({
        monthly: monthlyIncome,
        yearly: yearlyIncome,
        total: allIncome,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "שגיאה בטעינת נתוני ההכנסות" }),
      { status: 500 }
    );
  }
}
