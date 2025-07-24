'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageState } from '../(context)/UniversityFormContext';
import FloatingInput from "@/app/(components)/FloatingInput";
import { blobUrlToBase64 } from "../(hooks)/blobToBase64";
import DragNDrop from "@/app/(components)/DragNDrop";
import MessageAlert from "../(components)/CustomAlert";
import { Save, RefreshCw } from "lucide-react";

type UniversityData = {
    id: string;
    tag: string;
    full_name: string;
    short_name: string;
    address: string;
    image: ImageState;
    banner: ImageState;
    description: string;
};

export default function DashboardPage() {
    const [baseInfo, setBaseInfo] = useState<UniversityData>();
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<ImageState>(null);
    const [banner, setBanner] = useState<ImageState>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [tag, setTag] = useState("");
    const [isError, setIsError] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const getMe = async () => {
            const timestamp = Date.now();
            const response = await fetch(`/api/auth/me?_=${timestamp}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBaseInfo(data);
                setFullName(data.full_name);
                setShortName(data.short_name);
                setAddress(data.address);
                setDescription(data.description);
                setTag(data.tag);
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

        const response = await fetch(`/api/university/update/base`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            setMessages(['Успешное сохранение!']);
            setIsError(false);
        } else {
            setMessages(['Ошибка при сохранении данных']);
            setIsError(true);
        }
    };

    const handleReset = () => {
        if (baseInfo) {
            setFullName(baseInfo.full_name);
            setShortName(baseInfo.short_name);
            setAddress(baseInfo.address);
            setDescription(baseInfo.description);
            setImage(baseInfo.image === null ? null : {
                name: 'image',
                url: baseInfo.image
            });
            setBanner(baseInfo.banner === null ? null : {
                name: 'banner',
                url: baseInfo.banner
            });
        }
    };

    const unactive = fullName.length < 3 || fullName.length < 2 || address.length < 10 || description.length < 60;

    return (
        <>
            <MessageAlert messages={messages} isError={isError} afterDelay={() => location.reload()} />
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
                    className="relative mb-5 min-w-full sm:min-w-0 sm:w-[55%]"
                />

                <FloatingInput
                    id="shortName"
                    label="Краткое название"
                    value={shortName}
                    onChange={setShortName}
                    className="relative mb-6 min-w-full sm:min-w-0 sm:w-[25%]"
                    maxLength={100}
                />
                <FloatingInput
                    id="tag"
                    label="@Тег"
                    value={tag}
                    disabled
                    onChange={setTag}
                    className="relative flex-1 mb-6 min-w-full sm:min-w-0"
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
                        ${description ? 'top-2 text-sm text-blue-600' : 'top-4 text-base text-gray-400'}
                        peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600`}
                >
                    Описание
                </label>
            </div>

            <div className="flex flex-wrap gap-2 mt-10">
                <button
                    onClick={handleSave}
                    className={`flex-1 active:scale-[0.99] min-w-full flex justify-center gap-2 font-medium sm:min-w-0 sm:w-1/2 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} cursor-pointer transition text-center`}
                >
                    <Save />
                    Сохранить
                </button>
                <button
                    onClick={handleReset}
                    className="flex-1 active:scale-[0.99] min-w-full flex justify-center gap-2 font-medium sm:min-w-0 sm:w-1/2 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 cursor-pointer transition text-center"
                >
                    <RefreshCw />
                    Сбросить
                </button>
            </div>
        </>
    );
}
