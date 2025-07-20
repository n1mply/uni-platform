'use client';

import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import FloatingInput from "@/app/(components)/FloatingInput";
import { AtSign, Smartphone } from 'lucide-react';
import { useEffect, useState } from "react";
import { z } from "zod";
import ErrorAlert from "./ErrorAlert";

const emailSchema = z.string().email("Некорректный email");
const phoneSchema = z
    .string()
    .min(10, "Телефон должен содержать минимум 10 цифр")
    .regex(/^[0-9+\-() ]+$/, "Некорректный номер телефона");


export default function ContactsForm() {
    const { contacts, setContacts } = useUniversityForm();
    const { xPer, setXPer } = useUniversityForm();
    const [unactive, setUnactive] = useState(true)
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleContinue = () => {
        const errors: string[] = [];
        if (contacts.length >= 20) {
            errors.push(`Суммарное число контактов не должно превышать 20`);
        }

        contacts.forEach((contact, index) => {
            if (!contact.name.trim()) {
                errors.push(`Контакт ${index + 1}: Название не указано`);
            }

            if (contact.type === "email") {
                const res = emailSchema.safeParse(contact.value);
                if (!res.success) errors.push(`Контакт ${index + 1}: ${res.error.issues[0].message}`);
            }

            if (contact.type === "phone") {
                const res = phoneSchema.safeParse(contact.value);
                if (!res.success) errors.push(`Контакт ${index + 1}: ${res.error.issues[0].message}`);
            }
        });

        if (errors.length > 0) {
            setErrorMessages(errors);
            return;
        }

        setErrorMessages([]);
        setXPer(xPer + 1);
    };


    useEffect(() => {
        const validateContacts = async () => {
            let hasEmail = false;
            let hasPhone = false;

            for (let contact of contacts) {
                if (contact.type === 'email' && contact.name && contact.value) {
                    hasEmail = true;
                }
                else if (contact.type === 'phone' && contact.name && contact.value) {
                    hasPhone = true;
                }

                if (hasEmail && hasPhone) break;
            }
            setUnactive(!(hasEmail && hasPhone));
        }

        validateContacts();
    }, [contacts]);


    const addContact = (type: "phone" | "email") => {
        setContacts([
            ...contacts,
            { name: "", type: type, value: "" }
        ]);
    };

    const updateContact = (
        index: number,
        field: "name" | "value" | "type",
        value: string | "phone" | "email"
    ) => {
        const updated = [...contacts];

        if (field === "type") {
            if (value === "phone" || value === "email") {
                updated[index][field] = value;
            } else {
                console.error("Invalid contactType value");
                return;
            }
        } else {
            updated[index][field] = value as string;
        }

        setContacts(updated);
    };

    return (
        <div className="w-screen flex flex-col scale-[0.9]">
            <div className="border border-blue-400 mx-auto p-4 px-10 rounded-md">
                <h1 className="text-4xl text-left md:text-5xl max-w-2xl w-full mx-auto font-bold text-gray-900 mb-6">
                    Контакты
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl w-full mx-auto text-left">
                    Добавьте контактные данные и описание к ним, чтобы абитуриенты или студенты могли связаться с вами
                    Введите минимум один номер телефона и почту для продолжения(по этим контактам будет происходить подтверждение вашего ВУЗа в нашей системе)
                </p>
                
                <ErrorAlert errors={errorMessages} duration={5000}/>

                <div className="flex gap-4 justify-between mb-8 flex-wrap mx-auto">
                    <button
                        tabIndex={xPer !== 1 ? -1 : 0}
                        onClick={() => addContact("phone")}
                        className="bg-blue-600 text-white w-full max-w-2xl mx-auto px-6 py-3 rounded hover:bg-blue-700 transition"
                    >
                        <Smartphone className="absolute" />
                        Добавить номер
                    </button>
                    <button
                        tabIndex={xPer !== 1 ? -1 : 0}
                        onClick={() => addContact("email")}
                        className="bg-blue-600 text-white w-full max-w-2xl mx-auto px-6 py-3 rounded hover:bg-blue-700 transition"
                    >
                        <AtSign className="absolute" />
                        Добавить почту
                    </button>
                </div>

                {contacts.map((contact, index) => (
                    <div key={index}>
                        <div className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-gray-200 flex flex-col justify-center align-middle gap-0">
                            <input
                                className="w-full max-w-2xl mb-2 mx-auto text-lg text-gray-900 placeholder-black
             focus:outline-none focus:border-b-2 focus:border-blue-600
             border-b border-transparent transition duration-200
             hover:border-b hover:border-gray-400"
                                type="text"
                                tabIndex={xPer !== 1 ? -1 : 0}
                                value={contact.name}
                                placeholder={`Контакт ${index + 1}`}
                                onChange={(e) => updateContact(index, "name", e.target.value)}
                                id={`name-${index}`}
                            />

                            <FloatingInput
                                tabIndex={xPer !== 1 ? -1 : 0}
                                id={`value-${index}`}
                                label={contact.type === "phone" ? "Номер телефона" : "Адрес электронной почты"}
                                type={contact.type === "phone" ? "tel" : "email"}
                                value={contact.value}
                                onChange={(val) => updateContact(index, "value", val)}
                                className={'relative w-full max-w-2xl mx-auto mb-0'}
                            />
                        </div>
                    </div>

                ))}

                <button
                    tabIndex={xPer !== 1 ? -1 : 0}
                    onClick={() => handleContinue()}
                    disabled={unactive ? true : false}
                    className={`w-full max-w-2xl mb-2 mx-auto mt-10 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer'}  transition text-center block`}
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
}
