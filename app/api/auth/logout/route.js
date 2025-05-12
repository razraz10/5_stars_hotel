// ניתוק משתמש
export async function POST() {
    return new Response(JSON.stringify({ message: "התנתקת בהצלחה" }), {
      status: 200,
      headers: {
        "Set-Cookie": "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
      },
    });
  }
  