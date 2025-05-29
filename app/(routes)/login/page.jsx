"use client";
import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axiosSelf from "@/app/lib/axiosInstance";

export default function LoginRegister() {
  // טופס להרשם
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  //  להתחבר
  const [isLogin, setIsLogin] = useState(true);
  // טעינה
  const [loading, setLoading] = useState(false);

  //Zustand התחברות בזכות
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // שינוי ערכים בטופס
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // אינטרקציה עם מקש אנטר
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(); // בלי e כי זו קריאה רגילה, לא מהאירוע
    }
  };

  // שליחת טופס התחברות / רישום
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // אם כבר יש חשבון
      if (isLogin) {
        // התחברות
        const { data } = await axiosSelf.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        await login(data.user, data.token);
        // useAuthStore.getState().startRefreshTimer(); // התחלת טיימר רענון
        toast.success("כעת הינך מחובר/ת");
      } else {
        // רישום משתמש חדש
        const registerResponse = await axiosSelf.post(
          "/auth/register",
          formData
        );

        if (registerResponse.data.user && registerResponse.data.token) {
          // אם קיבלנו טוקן בהרשמה, נשתמש בו ישירות
          await login(registerResponse.data.user, registerResponse.data.token);
          toast.success("נרשמת והתחברת בהצלחה");
        }
      }
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "שגיאה לא ידועה");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "התחברות 🔑" : "הרשמה 📝"}
        </h1>

        <div className="flex flex-col space-y-4">
          {/*  טופס רישום אם הוא לא רשום  */}
          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="שם פרטי"
                className="p-2 border rounded"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="שם משפחה"
                className="p-2 border rounded"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
            </>
          )}
          {/* אם יש חשבון */}
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            className="p-2 border rounded"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה (8 ספרות בלבד)"
            className="p-2 border rounded"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            pattern="\d{8}"
            required
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "...טוען" : isLogin ? "התחבר" : "הירשם"}
          </button>
        </div>

        <p
          className="text-blue-500 text-center mt-4 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "אין לך חשבון? הירשם כאן" : "כבר יש לך חשבון? התחבר כאן"}
        </p>
      </div>
      <Toaster />
    </div>
  );
}
