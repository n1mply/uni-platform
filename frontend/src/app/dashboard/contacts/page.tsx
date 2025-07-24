'use client'
import { useState, useEffect } from "react"
import MessageAlert from "@/app/(components)/CustomAlert";
import { Save, RefreshCw } from "lucide-react";

type Contact = {
    id: number;
    university_tag: number;
    name: string;
    type: "phone" | "email";
    value: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [messages, setMessages] = useState<string[]>([])

    useEffect(() => {
        const getContacts = async () => {
            const response = await fetch(`/api/university/get/contacts`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.data)
                setContacts(data.data)
            }
            else{
                setMessages(['Ошибка при получении контактов'])
            }
        }
        getContacts()
    }, [])

    return (
        <>
            <MessageAlert messages={messages}/>
            <h1 className="text-2xl mt-10 lg:mt-0 font-bold mb-6">Контакты</h1>
            {contacts.map((c)=>(
                <div key={c.id}>{c.name}<br/>{c.value}</div>
            ))}
        </>
    )
}