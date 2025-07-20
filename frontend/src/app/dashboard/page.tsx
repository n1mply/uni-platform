'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { SidebarItem } from "../(components)/CustomSidebar";
import { Home, Settings, IdCardLanyard, Book, GraduationCap } from "lucide-react";
import { Contact, ImageState } from '../(context)/UniversityFormContext';
import FloatingInput from "@/app/(components)/FloatingInput";
import DragNDrop from "@/app/(components)/DragNDrop";

type UniversityData = {
    id: string;
    tag: string;
    fullName: string;
    shortName: string;
    address: string;
    image: ImageState;
    banner: ImageState;
    description: string;
    contact: Contact[];
};

export default function Dashboard() {
    const [baseInfo, setBaseInfo] = useState<UniversityData>();
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<ImageState>(null);
    const [banner, setBanner] = useState<ImageState>(null);

    const router = useRouter();

    const items: SidebarItem[] = [
        { option: 'Главная', link: '/dashboard', icon: <Home size={20} /> },
        { option: 'Сотрудники', link: '/dashboard/employees', icon: <IdCardLanyard size={20} /> },
        { option: 'Факультеты', link: '/dashboard/faculties', icon: <GraduationCap size={20} /> },
        { option: 'Кафедры', link: '/dashboard/departments', icon: <Book size={20} /> },
        { option: 'Настройки', link: '/dashboard/settings', icon: <Settings size={20} /> },
    ];

    useEffect(() => {
        const getMe = async () => {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setBaseInfo(data);
                setFullName(data.fullName);
                setShortName(data.shortName);
                setAddress(data.address);
                setDescription(data.description);
                setImage(data.image === 'string' ? null : data.image);
                setBanner(data.banner === 'string' ? null : data.banner);
            } else {
                router.push("/");
            }
        };

        getMe();
    }, [router]);

    const handleSave = async () => {
        const payload = {
            fullName,
            shortName,
            address,
            description,
            image,
            banner,
        };

        const res = await fetch(`/api/university/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert("Изменения сохранены!");
        } else {
            alert("Ошибка при сохранении");
        }
    };

    const unactive = !fullName || !shortName || !address || description.length < 60;

    return (
        <div className="flex min-h-screen">
            <Sidebar items={items} />

            <main className="flex-1 p-6 overflow-auto">
                {/* Баннер */}
                <div className="w-full mb-6">
                    <p className="mb-2 text-sm text-gray-600">Баннер</p>
                    <DragNDrop image={banner} setImage={setBanner} fit={false} w="w-full" h="h-[200px]" />
                </div>

                {/* Аватарка */}
                <div className="w-full sm:w-[300px] mb-6">
                    <p className="mb-2 text-sm text-gray-600">Аватарка ВУЗа</p>
                    <DragNDrop image={image} setImage={setImage} fit={false} w=''/>
                </div>

                {/* Основная информация */}
                <h1 className="text-2xl font-bold mb-6">Информация о ВУЗе</h1>

                <FloatingInput
                    id="fullName"
                    label="Полное название"
                    value={fullName}
                    onChange={setFullName}
                    className="relative w-full max-w-2xl mb-6"
                />

                <FloatingInput
                    id="shortName"
                    label="Краткое название"
                    value={shortName}
                    onChange={setShortName}
                    className="relative w-full max-w-2xl mb-6"
                />

                <FloatingInput
                    id="address"
                    label="Полный адрес"
                    value={address}
                    onChange={setAddress}
                    className="relative w-full max-w-2xl mb-6"
                />

                <div className="relative w-full max-w-2xl mb-6">
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="peer block w-full border border-gray-300 rounded px-4 pt-8 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 resize-none"
                        placeholder=" "
                        minLength={60}
                        maxLength={300}
                    />
                    <label
                        htmlFor="description"
                        className={`absolute left-4 transition-all duration-200 bg-white px-1
                        ${description
                                ? 'top-2 text-sm text-blue-600'
                                : 'top-4 text-base text-gray-400'
                            }
                        peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600`}
                    >
                        Описание
                    </label>
                </div>

                <button
                    onClick={handleSave}
                    className={`w-full max-w-2xl mb-2 mt-10 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} cursor-pointer transition text-center block`}
                >
                    Сохранить
                </button>
            </main>
        </div>
    );
}
