"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Network,
  User,
  Clock3,
} from "lucide-react";
import Logo from "../../public/images/manora-logo.png"
import Image from "next/image";

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
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#E8DCD5] px-4 py-4 shadow-lg">
        <Image src={Logo} alt="Logo" >
            
        </Image>
        
      <div className="mb-8 px-3 pt-0">

        <p className="mt-1 text-xs text-[#766963]">
          Breathe. Focus. Grow.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#D5C6BD] text-[#302824] shadow-sm"
                  : "text-[#665B55] hover:bg-[#DED0C8] hover:text-[#302824]"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className="shrink-0"
              />

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-[#D2C4BC] pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-[#665B55] transition-colors duration-200 hover:bg-[#DED0C8] hover:text-[#302824]"
        >
          Take a moment
        </button>
      </div>
    </aside>
  );
}