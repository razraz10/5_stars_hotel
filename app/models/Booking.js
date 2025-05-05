import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }, // הוספת שדה isActive
    isDeleted: { type: Boolean, default: false }, // הוספת שדה isActive
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// // Middleware שמעדכן את isActive לפני ביצוע קריאה
// BookingSchema.pre('find', function (next) {
//   const now = new Date();
//   // הגדרת סינון של פעילויות בהן תאריך סיום עבר
//   this.where({
//     isActive: { $ne: false }, // נשמור על active=true בהזמנות שעדיין לא עברו את תאריך הסיום
//     $or: [
//       { checkOutDate: { $gte: now } }, // אם תאריך הסיום לא עבר, נשאיר את ה-isActive
//     ],
//   });
//   next();
// });

// // Middleware שמעדכן את isActive לפני עדכון
// BookingSchema.pre('findOneAndUpdate', async function (next) {
//   const now = new Date();
//   const update = this.getUpdate();
  
//   // אם תאריך יציאה עבר, עדכון isActive ל-false
//   if (update.checkOutDate && new Date(update.checkOutDate) < now) {
//     update.isActive = false; // עדכון אוטומטי של isActive אם עבר תאריך הסיום
//   }
  
//   next();
// });

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
