'use client';

import { createContext, useContext, useState, ReactNode } from "react";

export type Contact = {
    contactName: string;
    contactType: "phone" | "email";
    contactValue: string;
};

export type ImageState = {
    name: string;
    url: string;
} | null;

type UniversityFormData = {
    contacts: Contact[];
    setContacts: (contacts: Contact[]) => void;
    xPer: number;
    setXPer: (xPer: number) => void;
    fullName: string;
    setFullName: (fullName: string) => void;
    shortName: string;
    setShortName: (shortName: string) => void;
    description: string;
    setDescription: (description: string) => void;
    address: string;
    setAddress: (address: string) => void;
    image: ImageState;
    setImage: (image: ImageState) => void;
};

const UniversityFormContext = createContext<UniversityFormData | null>(null);

export function UniversityFormProvider({ children }: { children: ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [xPer, setXPer] = useState(0);
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState<ImageState>(null);

    return (
        <UniversityFormContext.Provider value={{ contacts, setContacts, xPer, setXPer, fullName, setFullName, shortName, setShortName, description, setDescription, address, setAddress, image, setImage}}>
            {children}
        </UniversityFormContext.Provider>
    );
}

export function useUniversityForm() {
    const context = useContext(UniversityFormContext);
    if (!context) {
        throw new Error("useUniversityForm must be used within UniversityFormProvider");
    }
    return context;
}
