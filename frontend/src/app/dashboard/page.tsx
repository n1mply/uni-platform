'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageState } from '../(context)/UniversityFormContext';
import FloatingInput from "@/app/(components)/FloatingInput";
import { blobUrlToBase64 } from "../(hooks)/blobToBase64";
import DragNDrop from "@/app/(components)/DragNDrop";
import { Save, RefreshCw, Phone, Mail, X, Plus } from "lucide-react";
import { z } from "zod";
import { useAlertContext } from "../(context)/AlertContext";

const emailSchema = z.string().email("Некорректный email");
const phoneSchema = z
    .string()
    .min(10, "Телефон должен содержать минимум 10 цифр")
    .regex(/^[0-9+\-() ]+$/, "Некорректный номер телефона");

type UniversityData = {
    id: string;
    tag: string;
    full_name: string;
    short_name: string;
    address: string;
    image: ImageState;
    banner: ImageState;
    description: string;
    contacts: Contact[];
};

type Contact = {
    id: number;
    university_tag: number;
    name: string;
    type: "phone" | "email";
    value: string;
}

export default function DashboardPage() {
    const { showAlert, hideAlert } = useAlertContext();

    const [baseInfo, setBaseInfo] = useState<UniversityData>();
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<ImageState>(null);
    const [banner, setBanner] = useState<ImageState>(null);
    const [contacts, setContacts] = useState<Contact[]>([])
    const [tag, setTag] = useState("");
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContact, setNewContact] = useState({
        name: "",
        type: "phone" as "phone" | "email",
        value: ""
    });

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
                console.log(data)
                if (data.image === 'nourl' || data.image === null) {
                    setImage(null)
                    console.log('no image')
                }
                else {
                    setImage({
                        name: 'avatar',
                        url: data.image
                    });
                }

                if (data.banner === 'nourl' || data.banner === null) {
                    setBanner(null)
                    console.log('no baner')
                }
                else {
                    setBanner({
                        name: 'banner',
                        url: data.banner
                    });
                }
            } else {
                router.push("/");
            }
        };

        getMe();
    }, [router]);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await fetch(`/api/contact/get/all`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();

                    setContacts(data.data);
                    setBaseInfo(prevInfo => ({
                        ...prevInfo,
                        contacts: data.data
                    }));
                } else {
                    showAlert(["Ошибка при получении контактов"]);
                    router.push('/');
                }
            } catch {
                showAlert(["Ошибка при получении контактов"]);
                router.push('/');
            }
        };

        getContacts();
    }, [router, showAlert]);

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
            showAlert(["Данные сохранены"], false);
        } else {
            showAlert(["Ошибка при сохранении"]);
        }
    };

    const handleReset = () => {
        if (baseInfo) {
            setFullName(baseInfo.full_name);
            setShortName(baseInfo.short_name);
            setAddress(baseInfo.address);
            setDescription(baseInfo.description);
            setContacts(baseInfo.contacts)
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

    const deleteContact = async (id: number) => {
        const response = await fetch(`/api/contact/delete/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            showAlert(["Контакт удалён"], false);
        }
        else {
            showAlert(["Не удалось удалить контакт"]);
        }

        setContacts(prevContacts => {
            const contactToDelete = prevContacts.find(contact => contact.id === id);

            if (!contactToDelete) {
                showAlert(["Не удалось удалить контакт"]);
                return prevContacts;
            }
            return prevContacts.filter(contact => contact.id !== id);
        });
    }

    const addContact = async () => {
        if (!newContact.name) {
            showAlert(["Дайте контакту имя!"]);
            return;
        }

        try {
            if (newContact.type === "email") {
                emailSchema.parse(newContact.value);
            } else {
                phoneSchema.parse(newContact.value.replace(/[^0-9]/g, '')); // Удаляем все нецифровые символы для валидации
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                showAlert(error.errors.map(err => err.message));
                return;
            }
        }

        const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;

        const payload = {
            name: newContact.name,
            type: newContact.type,
            value: newContact.value
        }

        const response = await fetch(`/api/contact/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            showAlert(["Контакт создан"], false);
        }
        else {
            showAlert(["Не удалось создать контакт"]);
        }

        setContacts(prev => [
            ...prev,
            {
                id: newId,
                university_tag: parseInt(tag),
                name: newContact.name,
                type: newContact.type,
                value: newContact.value
            }
        ]);

        setNewContact({
            name: "",
            type: "phone",
            value: ""
        });
        setShowAddContact(false);
    };

    const unactive = fullName.length < 3 || fullName.length < 2 || address.length < 10 || description.length < 60;

    const handleTest = async() =>{
        console.log(banner)
    }

    return (
        <>
            <h1 className="text-2xl mt-10 lg:mt-0 font-bold mb-6">Информация о ВУЗе</h1>
            <button onClick={()=>handleTest()}>
                TEST BTN
            </button>
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

            <div className="mt-10 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-gray-600">Контакты ВУЗа</p>
                    <button
                        onClick={() => setShowAddContact(!showAddContact)}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <Plus size={16} />
                        Добавить контакт
                    </button>
                </div>

                {showAddContact && (
                    <div className="border border-gray-300 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FloatingInput
                                id="contactName"
                                label="Название контакта"
                                value={newContact.name}
                                onChange={(val) => setNewContact({ ...newContact, name: val })}
                                className="relative"
                            />

                            <div className="relative">
                                <div className="flex border h-full border-gray-300 rounded-md overflow-hidden">
                                    <button
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 ${newContact.type === 'phone' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}
                                        onClick={() => setNewContact({ ...newContact, type: 'phone' })}
                                    >
                                        <Phone size={16} />
                                        Телефон
                                    </button>
                                    <button
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 ${newContact.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}
                                        onClick={() => setNewContact({ ...newContact, type: 'email' })}
                                    >
                                        <Mail size={16} />
                                        Email
                                    </button>
                                </div>
                            </div>

                            <FloatingInput
                                id="contactValue"
                                label={newContact.type === 'phone' ? 'Номер телефона' : 'Email адрес'}
                                value={newContact.value}
                                onChange={(val) => setNewContact({ ...newContact, value: val })}
                                className="relative"
                                type={newContact.type === 'email' ? 'email' : 'tel'}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowAddContact(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={addContact}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="flex flex-col border rounded-md p-2 border-gray-300 text-gray-900 hover:border-blue-600 transition-all duration-200">
                            <div className="flex justify-between">
                                <div>
                                    <p>{contact.name}:</p>
                                    <div className="flex ml-4 items-center gap-1">
                                        {contact.type === 'phone' ? <Phone size={16} /> : <Mail size={16} />}
                                        <p>{contact.value}</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteContact(contact.id)} className="transition-all duration-200 hover:scale-[1.05]"><X /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-sm text-gray-600"><span className="font-medium">ВАЖНО:</span> На контакты не распространются кнопи &quot;Сохранить&quot; и &quot;Сбросить&quot;, действия с контактами происходят мгновенно</p>
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