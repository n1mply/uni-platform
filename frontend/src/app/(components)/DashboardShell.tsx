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
  {
    option: "Главная",
    links: [{ option: "Главная", link: "/dashboard" }],
    icon: <Home size={20} />
  },
  {
    option: "Кафедры",
    links: [
      { option: "Все кафедры", link: "/dashboard/departments" },
      { option: "Создать кафедру", link: "/dashboard/departments/create" },
      { option: "Архив", link: "/dashboard/departments/archive" }
    ],
    icon: <Book size={20} />
  },
  {
    option: "Факультеты",
    links: [
      { option: "Список факультетов", link: "/dashboard/faculties" },
      { option: "Добавить факультет", link: "/dashboard/faculties/create" }
    ],
    icon: <GraduationCap size={20} />
  },
  {
    option: "Специальности",
    links: [{ option: "Все специальности", link: "/dashboard/specialties" },
            {option: "Добавить специальность", link: "/dashboard/specialties/create"}
    ],
    icon: <Telescope size={20} />
  },
  {
    option: "Сотрудники",
    links: [
      { option: "Все сотрудники", link: "/dashboard/employees" },
      { option: "Добавить сотрудника", link: "/dashboard/employees/create" },
      { option: "Отчеты", link: "/dashboard/employees/reports" }
    ],
    icon: <IdCardLanyard size={20} />
  },
  {
    option: "Миграции",
    links: [{ option: "Миграции", link: "/dashboard/migration" }],
    icon: <PackageOpen size={20} />
  },
  {
    option: "Настройки",
    links: [{ option: "Настройки", link: "/dashboard/settings" }],
    icon: <Settings size={20} />
  },
];
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AlertMessagesProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar items={items} />
        <main className="flex-1 p-6 overflow-auto bg-white shadow-lg rounded-xl m-6">
          {children}
        </main>
      </div>
    </AlertMessagesProvider>
  );
}
