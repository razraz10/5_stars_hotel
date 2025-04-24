import { verifyToken } from "@/app/lib/auth/verifyToken";
import { dbConnect } from "@/app/lib/db";
import Room from "@/app/models/Room";
import { v2 as cloudinary } from "cloudinary";

export async function GET(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
if (error) {
  return new Response(JSON.stringify({ message: error }), { status });
}

// לאחר שהטוקן אושר, אפשר לבדוק אם למשתמש יש את ההרשאות המתאימות
if (decoded.role !== 'admin') {
  return new Response(JSON.stringify({ message: "אין לך הרשאות לבצע פעולה זו" }), { status: 403 });
}


  try {
    const { searchParams } = new URL(req.url);
    const roomNumber = searchParams.get("roomNumber");

    const errorsRoom = [];
    if (!roomNumber) {
      return new Response(JSON.stringify({ message: "צריך להזין מספר חדר" }), {
        status: 400,
      });
    }

    const room = await Room.findOne({ roomNumber });

    if (!room) {
      errorsRoom.push("לא נמצא חדר עם המספר הזה");
      return new Response(
        JSON.stringify({
          message: "לא נמצא חדר עם המספר הזה",
          errors: errorsRoom,
        }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "שגיאה בטעינת חדר" }), {
      status: 500,
    });
  }
}

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

// פונקציה שמעלה את הקובץ ל-Cloudinary באמצעות Promise
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "rooms" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// יצירת חדר
export async function POST(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }
  
  // לאחר שהטוקן אושר, אפשר לבדוק אם למשתמש יש את ההרשאות המתאימות
  if (decoded.role !== 'admin') {
    return new Response(JSON.stringify({ message: "אין לך הרשאות לבצע פעולה זו" }), { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const missingFields = [];

    if (!file) {
      missingFields.push("אין תמונה");
    }

    const roomNumber = formData.get("roomNumber");
    const roomType = formData.get("roomType");
    const price = formData.get("price");
    const view = formData.get("view");
    const availability = formData.get("availability") === "true";
    const roomSize = formData.get("roomSize");
    const bedType = formData.get("bedType");
    const airConditioning = formData.get("airConditioning") === "true";
    const dailyCleaning = formData.get("dailyCleaning") === "true";
    const smokingAllowed = formData.get("smokingAllowed") === "true";
    const petsAllowed = formData.get("petsAllowed") === "true";
    const maxOccupancy = formData.get("maxOccupancy");
    const bathroomType = formData.get("bathroomType");
    const floor = formData.get("floor");
    const balcony = formData.get("balcony") === "true";
    const active = true;

    if (!roomNumber) missingFields.push("חסר מספר חדר");
    if (!roomType) missingFields.push("חסר סוג חדר");
    if (!price) missingFields.push("חסר מחיר");
    if (!view) missingFields.push("חסר נוף");
    if (!roomSize) missingFields.push("חסר מידת חדר");
    if (!bedType) missingFields.push("חסר סוג מיטה");
    if (!floor) missingFields.push("חסר קומת החדר");
    if (formData.get("availability") === null) missingFields.push("חסר זמינות");
    if (formData.get("airConditioning") === null)
      missingFields.push("חסר מיזוג אוויר");
    if (formData.get("dailyCleaning") === null)
      missingFields.push("חסר זמן ניקיון");
    if (formData.get("smokingAllowed") === null)
      missingFields.push("חסר אפשרות לעישון");
    if (formData.get("petsAllowed") === null)
      missingFields.push("חסר אפשרות לחיות מחמד");
    if (formData.get("maxOccupancy") === null)
      missingFields.push("חסר מקסימום אנשים בחדר");
    if (formData.get("bathroomType") === null)
      missingFields.push("חסר סוג מקלחת");
    if (formData.get("balcony") === null) missingFields.push("חסר אם יש מרפסת");

    // אם יש שדות חסרים, מחזירים הודעת שגיאה עם כל השדות החסרים
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ message: "חסרים שדות חובה", errors: missingFields }),
        {
          status: 400,
        }
      );
    }

    // המשך הקוד אם כל השדות קיימים
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let uploadResponse;
    try {
      uploadResponse = await uploadToCloudinary(buffer);
    } catch (uploadError) {
      console.log("Upload Error:", uploadError);
      return new Response(
        JSON.stringify({
          message: "שגיאה בהעלאת תמונה",
          error: uploadError.message,
        }),
        { status: 500 }
      );
    }

    const { secure_url } = uploadResponse;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return new Response(JSON.stringify({ message: "החדר כבר קיים במערכת" }), {
        status: 400,
      });
    }

    const newRoom = await Room.create({
      roomNumber,
      roomType,
      price,
      view,
      availability,
      active,
      imageUrl: secure_url,
      roomSize,
      bedType,
      airConditioning,
      dailyCleaning,
      smokingAllowed,
      petsAllowed,
      maxOccupancy,
      bathroomType,
      floor,
      balcony,
    });

    return new Response(JSON.stringify(newRoom), { status: 201 });
  } catch (error) {
    // console.log("General Error:", error);
    return new Response(
      JSON.stringify({ message: "שגיאה ביצירת חדר", error: error.message }),
      { status: 500 }
    );
  }
}

// עידכון חדר
export async function PUT(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }
  
  // לאחר שהטוקן אושר, אפשר לבדוק אם למשתמש יש את ההרשאות המתאימות
  if (decoded.role !== 'admin') {
    return new Response(JSON.stringify({ message: "אין לך הרשאות לבצע פעולה זו" }), { status: 403 });
  }


  try {
    const formData = await req.formData();
    const roomId = formData.get("roomId");
    // כל השדות
    const roomNumber = formData.get("roomNumber");
    const roomType = formData.get("roomType");
    const price = formData.get("price");
    const view = formData.get("view");
    const availability = formData.get("availability") === "true"; // הופך ל-Boolean
    const roomSize = formData.get("roomSize");
    const bedType = formData.get("bedType");
    const airConditioning = formData.get("airConditioning");
    const dailyCleaning = formData.get("dailyCleaning");
    const smokingAllowed = formData.get("smokingAllowed");
    const petsAllowed = formData.get("petsAllowed");
    const maxOccupancy = formData.get("maxOccupancy");
    const bathroomType = formData.get("bathroomType");
    const floor = formData.get("floor");
    const balcony = formData.get("balcony");
    const active = true; // הופך ל-Boolean
    const file = formData.get("file"); // תמונה חדשה (אם יש)

    if (
      !roomNumber ||
      !roomType ||
      !price ||
      !view ||
      !roomSize ||
      !bedType ||
      !airConditioning ||
      !dailyCleaning ||
      !smokingAllowed ||
      !petsAllowed ||
      !maxOccupancy ||
      !bathroomType ||
      !floor ||
      !balcony ||
      availability === undefined
    ) {
      const missingFields = [];
      if (!roomNumber) missingFields.push("חסר מספר חדר");
      if (!roomType) missingFields.push("חסר סוג חדר");
      if (!price) missingFields.push("חסר מחיר");
      if (!view) missingFields.push("חסר נוף");
      if (!roomSize) missingFields.push("חסר מידת חדר");
      if (!bedType) missingFields.push("חסר סוג מיטה");
      if (!floor) missingFields.push("חסר קומת החדר");
      if (!airConditioning) missingFields.push("חסר מיזוג אויר");
      if (!dailyCleaning) missingFields.push("חסר זמני ניקיון");
      if (!smokingAllowed) missingFields.push("חסר אם מותר לעשן");
      if (!petsAllowed) missingFields.push("חסר אם מותר חיות מחמד");
      if (!maxOccupancy) missingFields.push("חסר מקסימום אנשים בחדר");
      if (!bathroomType) missingFields.push("חסר סוג מקלחת");
      if (!balcony) missingFields.push("חסר אם יש מרפסת");
      if (availability === undefined) missingFields.push("חסר זמינות");

      return new Response(
        JSON.stringify({ message: "חסרים שדות חובה", errors: missingFields }),
        {
          status: 400,
        }
      );
    }

    // עידכון התמונה
    let imageUrl;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // מעלה את התמונה החדשה ל-Cloudinary
      let uploadResponse;
      try {
        uploadResponse = await uploadToCloudinary(buffer);
        imageUrl = uploadResponse.secure_url; // URL של התמונה החדשה
      } catch (uploadError) {
        console.log("Upload Error:", uploadError);
        return new Response(
          JSON.stringify({
            message: "שגיאה בהעלאת תמונה",
            error: uploadError.message,
          }),
          { status: 500 }
        );
      }
    }

    // עידכון החדר
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        roomNumber,
        roomType,
        price,
        view,
        availability,
        active,
        imageUrl: imageUrl || undefined, // אם הועלתה תמונה חדשה, מעדכנים את ה-URL שלה
        roomSize,
        bedType,
        airConditioning,
        dailyCleaning,
        smokingAllowed,
        petsAllowed,
        maxOccupancy,
        bathroomType,
        floor,
        balcony,
      },
      { new: true }
    );

    if (!updatedRoom) {
      return new Response(JSON.stringify({ message: "החדר לא נמצא" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "שגיאה בעדכון חדר", error: error.message }),
      { status: 500 }
    );
  }
}

// מחיקת חדר
export async function DELETE(req) {
  await dbConnect();

  const { decoded, error, status } = verifyToken(req);
  if (error) {
    return new Response(JSON.stringify({ message: error }), { status });
  }
  
  // לאחר שהטוקן אושר, אפשר לבדוק אם למשתמש יש את ההרשאות המתאימות
  if (decoded.role !== 'admin') {
    return new Response(JSON.stringify({ message: "אין לך הרשאות לבצע פעולה זו" }), { status: 403 });
  }
  

  try {
    const { roomId } = await req.json();

    if (!roomId) {
      return new Response(JSON.stringify({ message: "לא נמסר מזהה חדר" }), {
        status: 400,
      });
    }

    // מחיקת החדר במסד הנתונים
    const deletedRoom = await Room.findByIdAndUpdate(
      roomId,
      { active: false },
      { new: true }
    );

    if (!deletedRoom) {
      return new Response(JSON.stringify({ message: "החדר לא נמצא במערכת" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "החדר נמחק בהצלחה" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "שגיאה במחיקת חדר", error: error.message }),
      { status: 500 }
    );
  }
}
