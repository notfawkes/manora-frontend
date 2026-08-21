"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Network,
  User,
  Clock3,
  Menu,
  X,
  History,
  LogOut,
} from "lucide-react";
import Logo from "../../public/images/manora-logo.png";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  {
    label: "Buddy",
    href: "/buddy",
    icon: MessageCircle,
  },
  {
    label: "Memory Tree",
    href: "/memory-tree",
    icon: Network,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock3,
  },
  {
    label: "Chat History",
    href: "/chat-history",
    icon: History,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle Navigation Menu"
        className="fixed top-4 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8DCD5]/90 text-[#302824] shadow-md backdrop-blur-md transition hover:bg-[#DED0C8] active:scale-95 md:hidden"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#E8DCD5] px-4 py-5 shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-4">
          <Image src={Logo} alt="Manora Logo" priority className="h-auto w-36 object-contain" />
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#665B55] hover:bg-[#DED0C8] md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-[#D5C6BD] text-[#302824] shadow-sm font-semibold"
                    : "text-[#665B55] hover:bg-[#DED0C8] hover:text-[#302824]"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="shrink-0"
                />

                <span className="text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto border-t border-[#D2C4BC] pt-4 flex flex-col gap-2">
          
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[#665B55] transition-all duration-200 hover:bg-red-100 hover:text-red-700"
          >
            <LogOut size={20} strokeWidth={1.8} className="shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}