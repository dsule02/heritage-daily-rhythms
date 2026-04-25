"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Activity, Users } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Today", href: "/", icon: Home },
    { name: "Modules", href: "/learning", icon: BookOpen },
    { name: "Growth", href: "/growth", icon: Activity },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-[#1e1e1e] border-t border-white/5 pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-[72px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 transition-colors",
                isActive ? "text-[#3B6A56]" : "text-bedtime-muted hover:text-bedtime-text"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
