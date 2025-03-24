// components/dashboard/DashboardSidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FileText, Settings, CreditCard, HelpCircle } from "lucide-react";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: Package },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Purchases", href: "/dashboard/purchases", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white border-r h-[calc(100vh-64px)] p-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md group w-full ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}