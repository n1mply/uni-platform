'use client';

import Sidebar, { SidebarItem } from "../(components)/CustomSidebar";
import { AlertMessagesProvider } from "../(context)/AlertContext";
import {
  Home,
  Settings,
  IdCardLanyard,
  Book,
  GraduationCap,
  PackageOpen,
  Telescope
} from "lucide-react";

const items: SidebarItem[] = [
  { option: "Главная", link: "/dashboard", icon: <Home size={20} /> },
  { option: "Кафедры", link: "/dashboard/departments", icon: <Book size={20} /> },
  { option: "Факультеты", link: "/dashboard/faculties", icon: <GraduationCap size={20} /> },
  { option: "Специальности", link: "/dashboard/specialties", icon: <Telescope size={20} /> },
  { option: "Сотрудники", link: "/dashboard/employees", icon: <IdCardLanyard size={20} /> },
  { option: "Миграции", link: "/dashboard/migration", icon: <PackageOpen size={20} /> },
  { option: "Настройки", link: "/dashboard/settings", icon: <Settings size={20} /> },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AlertMessagesProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar items={items} />
        <main className="flex-1 p-6 overflow-auto bg-white shadow-lg scale-[0.96] rounded-xl">
          {children}
        </main>
      </div>
    </AlertMessagesProvider>
  );
}
