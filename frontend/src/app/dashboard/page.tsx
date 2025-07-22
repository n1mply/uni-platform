'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar, { SidebarItem } from "../(components)/CustomSidebar";
import { Home, Settings, IdCardLanyard, Book, GraduationCap, Save, RefreshCw, Mail, Bot } from "lucide-react";
import { Contact, ImageState } from '../(context)/UniversityFormContext';
import FloatingInput from "@/app/(components)/FloatingInput";
import { blobUrlToBase64 } from "../(hooks)/blobToBase64";
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
        { option: 'Главная', link: '/dashboard/', icon: <Home size={20} /> },
        { option: 'Контакты', link: '/dashboard/contacts', icon: <Mail size={20} /> },
        { option: 'Сотрудники', link: '/dashboard/employees', icon: <IdCardLanyard size={20} /> },
        { option: 'Факультеты', link: '/dashboard/faculties', icon: <GraduationCap size={20} /> },
        { option: 'Кафедры', link: '/dashboard/departments', icon: <Book size={20} /> },
        { option: 'Миграции', link: '/dashboard/migration', icon: <Bot size={20} /> },
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
                console.log(data)
                setBaseInfo(data);
                setFullName(data.fullName);
                setShortName(data.shortName);
                setAddress(data.address);
                setDescription(data.description);
                setImage(data.image === null ? null : {
                    name: 'avatar',
                    url: data.image
                });
                setBanner(data.banner === null ? null : {
                    name: 'banner',
                    url: data.banner
                });
            } else {
                router.push("/");
            }
        };

        getMe();
    }, [router]);



    const handleSave = async () => {
        let imageData = null;
        let bannerData = null;

        if (image) {
            const base64 = await blobUrlToBase64(image.url);
            imageData = {
                name: image.name,
                base64,
                type: 'avatar',
            };
        }

        if (banner) {
            const base64 = await blobUrlToBase64(banner.url);
            bannerData = {
                name: banner.name,
                base64,
                type: 'banner',
            };
        }

        const payload = {
            fullName,
            shortName,
            address,
            description,
            image: imageData,
            banner: bannerData,
        };

        console.log("Отправляемые данные:", JSON.stringify(payload, null, 2));

        const res = await fetch(`/api/university/update/base`, {
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


    const handleReset = () => {
        if (baseInfo) {
            setFullName(baseInfo.fullName);
            setShortName(baseInfo.shortName);
            setAddress(baseInfo.address);
            setDescription(baseInfo.description);
            setImage(baseInfo.image === null ? null : baseInfo.image);
            setBanner(baseInfo.banner === null ? null : baseInfo.banner);
        }
    };

    const unactive = fullName.length < 3 || shortName.length < 2 || address.length < 10 || description.length < 60;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar items={items} />

            <main className="flex-1 p-6 overflow-auto bg-white shadow-lg scale-[0.96] rounded-xl">
                <h1 className="text-2xl mt-10 lg:mt-0 font-bold mb-6">Информация о ВУЗе</h1>
                <div className="w-full mb-6">
                    <p className="mb-2 text-sm text-gray-600">Баннер</p>
                    <DragNDrop image={banner} setImage={setBanner} proportion={false} height='200px' label={`Перетащите файл сюда или нажмите, чтобы загрузить. Добавьте изображение размером минимум 1280x200px`} />
                </div>

                <div className="w-full sm:w-[300px] mb-6">
                    <p className="mb-2 text-sm text-gray-600">Аватарка ВУЗа</p>
                    <DragNDrop image={image} setImage={setImage} proportion={true} height='200px' />
                </div>

                <div className="flex flex-wrap gap-2">
                    <FloatingInput
                        id="fullName"
                        label="Полное название"
                        value={fullName}
                        onChange={setFullName}
                        maxLength={255}
                        className="relative mb-5 flex-1 min-w-full sm:min-w-0 sm:w-1/2"
                    />

                    <FloatingInput
                        id="shortName"
                        label="Краткое название"
                        value={shortName}
                        onChange={setShortName}
                        className="relative mb-6 flex-1 min-w-full sm:min-w-0 sm:w-1/2"
                        maxLength={100}
                    />
                </div>

                <FloatingInput
                    id="address"
                    label="Полный адрес"
                    value={address}
                    onChange={setAddress}
                    className="relative w-full mb-6"
                    maxLength={255}
                />

                <div className="relative w-full mb-6">
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

                <div className="flex flex-wrap gap-2 mt-10">
                    <button
                        onClick={handleSave}
                        className={`flex-1 min-w-full flex justify-center gap-2 font-medium sm:min-w-0 sm:w-1/2 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} cursor-pointer transition text-center`}
                    >
                        <Save />
                        Сохранить
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex-1 min-w-full flex justify-center gap-2 font-medium sm:min-w-0 sm:w-1/2 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 cursor-pointer transition text-center"
                    >
                        <RefreshCw />
                        Сбросить
                    </button>
                </div>
            </main>
        </div>
    );
}