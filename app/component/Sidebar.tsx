"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Settings,
} from "lucide-react";

const links = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  
  
  { href: "/staff", label: "Staff", icon: <Users className="w-5 h-5" /> },
  { href: "/workers", label: "Workers", icon: <Users className="w-5 h-5" /> },
    {
    href: "/inventry",
    label: "inventry Management System",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    href: "/foodCard",
    label: "Food Card Details",
    icon: <Settings className="w-5 h-5" />,
  },
];

const Sidebar: React.FC = () => {
  const path = usePathname() || "/";
 
  return (
    <aside className=" w-16 md:w-48 p-2 bg-header   text-black ">
      <nav className="overflow-y-auto w-full h-[calc(100vh-80px)]">
        {links.map((link) => {
          const isActive = link.href === '/'+path?.split('/')[1];
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex  flex-col md:flex-row text-white items-center mb-2 py-2 px-3 text-xs font-medium rounded-3xl cursor-pointer transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-primary  hover:text-white"
                }`}
              >
                <div className="mr-2 text-xs">{link.icon}</div>
                <span className="text-[9px] md:inline-block">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
