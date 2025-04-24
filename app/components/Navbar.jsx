"use client";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // מרנדר את היוזר בקליינט ולא בשרת
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-blue-600 p-4 shadow-md top-0 sticky z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">🏨 MyHotel</h1>
        {isClient && user?.role === "admin" && (
          <div>
            <div className="bg-yellow-200 text-center rounded-full cursor-default">
              {user?.role}
            </div>
            <Link href="/managerPage" className="text-white cursor-pointer ">
              ניהול המלון
            </Link>
          </div>
        )}
        <div className="space-x-4 flex items-center">
          <Link href="/home" className="text-white cursor-pointer ">
            בית
          </Link>
          <Link href="/rooms" className="text-white cursor-pointer ">
            חדרים
          </Link>
          {isClient && !user?.role ? (
            <Link
              href="/login"
              className="text-white bg-green-300 p-1 rounded-full cursor-pointer "
            >
              <LogIn />
            </Link>
          ) : (
            isClient &&
            user?.role && (
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded flex gap-3"
                >
                  <LogOut />
                </button>
                <Link href="/personal">
                  <div className="flex bg-gray-500 rounded-full cursor-pointer px-3 py-1 text-black items-center gap-2">
                    {user?.firstName}
                    <User />
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
