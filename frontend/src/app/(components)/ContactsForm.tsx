'use client';

import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import FloatingInput from "@/app/(components)/FloatingInput";
import { AtSign, Smartphone  } from 'lucide-react';import { useState } from "react";
;


export default function ContactsForm() {
    const { contacts, setContacts } = useUniversityForm();
    const { xPer, setXPer } = useUniversityForm();
    const [unactive, setUnactive] = useState(true)

    const addContact = (type: "phone" | "email") => {
        setContacts([
            ...contacts,
            { contactName: "", contactType: type, contactValue: "" }
        ]);
    };

    const updateContact = (
        index: number,
        field: "contactName" | "contactValue" | "contactType",
        value: string | "phone" | "email"
    ) => {
        const updated = [...contacts];

        if (field === "contactType") {
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
        <section className="w-screen flex justify-center flex-col text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Контакты
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Добавьте контактные данные и описание к ним, чтобы абитуриенты или студенты могли связаться с вами
                <br />
                Введите минимум один номер телефона и почту для продолжения
            </p>

            <div className="flex gap-4 justify-between mb-8 flex-wrap mx-auto">
                <button
                    onClick={() => addContact("phone")}
                    className="bg-blue-600 text-white w-full max-w-2xl mx-auto px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                    <Smartphone className="absolute"/>
                    Добавить номер
                </button>
                <button
                    onClick={() => addContact("email")}
                    className="bg-blue-600 text-white w-full max-w-2xl mx-auto px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                    <AtSign className="absolute"/>
                    Добавить почту
                </button>
            </div>

            {contacts.map((contact, index) => (
                <div key={index} className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-gray-200 flex flex-col justify-center align-middle gap-0">
                    <FloatingInput
                        id={`name-${index}`}
                        label="Название контакта"
                        value={contact.contactName}
                        onChange={(val) => updateContact(index, "contactName", val)}
                    />
                    <FloatingInput
                        id={`value-${index}`}
                        label={contact.contactType === "phone" ? "Номер телефона" : "Адрес электронной почты"}
                        type={contact.contactType === "phone" ? "tel" : "email"}
                        value={contact.contactValue}
                        onChange={(val) => updateContact(index, "contactValue", val)}
                        className={'relative w-full max-w-2xl mx-auto mb-0'}
                    />
                </div>

            ))}

            <button
                onClick={() => setXPer(-100)}
                disabled={unactive ? true : false}
                className={`w-full max-w-2xl mx-auto mt-30 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer'}  transition text-center block`}
            >
                Продолжить
            </button>
        </section>
    );
}
