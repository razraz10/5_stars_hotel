"use client";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { LogIn, LogOut, User, Menu, X } from "lucide-react";
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

  // const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  return (
    <nav className="bg-blue-600 p-4 shadow-md sticky top-0 z-40">
      <div className="  flex justify-between items-center relative">
        <h1 className="text-white text-2xl font-bold">🏨 MyHotel</h1>

        {/* Admin badge - both desktop & mobile */}
        { user?.role === "admin" && (
          <div className=" flex-col text-center items-center">
            <div className="bg-yellow-200 text-center rounded-full cursor-default px-2">
              {user?.role}
            </div>
            <Link
              href="/managerPage"
              className="text-white w-full text-center cursor-pointer"
            >
              ניהול המלון
            </Link>
          </div>
        )}

        {/* Mobile menu button */}
        <div className="md:hidden ">
          <button className="cursor-pointer transition-all duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X color="white" /> : <Menu color="white" />}
          </button>
          {/* Mobile dropdown menu */}
          {isMenuOpen && (
            <div className="absolute  right-1 md:hidden bg-blue-700 rounded-2xl p-4 space-y-3 text-white shadow-lg z-50 w-1/3">
              <div className="flex flex-col text-right">
                <Link href="/home" onClick={() => setIsMenuOpen(false)}>
                  בית
                </Link>
                <Link href="/rooms" onClick={() => setIsMenuOpen(false)}>
                  חדרים
                </Link>
              </div>

              { !user?.role ? (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-green-300 text-black px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <LogIn />
                  התחברות
                </Link>
              ) : (
                user?.role && (
                  <div className="flex flex-col space-y-1">
                    <Link href="/personal" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex bg-gray-500 rounded-full px-3 py-1  text-black justify-end items-center gap-2">
                        <div dir="rtl" className="truncate">
                          {user?.firstName}
                        </div>
                        <User />
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-500 truncate justify-center items-center cursor-pointer text-white px-3 py-1 rounded flex gap-2 w-full"
                    >
                      <LogOut />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/home" className="text-white">
            בית
          </Link>
          <Link href="/rooms" className="text-white">
            חדרים
          </Link>

          { !user?.role ? (
            <Link
              href="/login"
              className="text-white bg-green-300 p-1 rounded-full"
            >
              <LogIn />
            </Link>
          ) : (
            user?.role && (
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded flex gap-2"
                >
                  <LogOut />
                </button>
                <Link href="/personal">
                  <div className="flex bg-gray-500 rounded-full px-3 py-1 text-black items-center gap-2">
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
