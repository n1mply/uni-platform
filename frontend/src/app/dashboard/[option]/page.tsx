'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Sidebar, {SidebarItem} from "@/app/(components)/CustomSidebar";
import { Home, Settings, IdCardLanyard, Book, GraduationCap } from "lucide-react";

type universityData = {
    baseInfo: {
        id: string;
        fullName: string;
        shortName: string;
        description: string;
        address: string;
        universityImage: string;
        universityTag: string;
        contact: string;
    },
    structure: {
        faculties: [],
        departments: []
    },
    employees: [],
};

export default function Dashboard({ }) {
    const [fullInfo, setFullInfo] = useState()
    const router = useRouter();
    const items: SidebarItem[] = [
    { option: 'Главная', link: '/dashboard', icon: <Home size={20} /> },
    { option: 'Сотрудники', link: '/dashboard/employees', icon: <IdCardLanyard size={20} /> },
    { option: 'Факультеты', link: '/dashboard/faculties', icon: <GraduationCap size={20} /> },
    { option: 'Кафедры', link: '/dashboard/departments', icon: <Book size={20} /> },
    { option: 'Настройки', link: '/dashboard/settings', icon: <Settings size={20} /> },
  ]

    useEffect(() => {
        const getMe = async () => {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                setFullInfo(data)
                console.log(data)
            }
            else {
                router.push("/")
            }
        }
        getMe()
    }, [])


    return (
        <div className="flex min-h-screen">
            <Sidebar items={items} />
            <main>
                {fullInfo?.fullName}
            </main>  
        </div>
    )
}