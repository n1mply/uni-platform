'use client';

import { createContext, useContext, useState, ReactNode } from "react";

export type Contact = {
    name: string;
    type: "phone" | "email";
    value: string;
};

export type ImageState = {
    name: string;
    url: string;
} | null;

export interface Faculty {
    name: string;
    iconURL: ImageState;
}

export interface Employee {
    position: string;
    academicDegree: string;
    fullName: string;
    isDepHead?: boolean;
    photoURL?: ImageState;
}

export interface Department {
    name: string;
    phone: string;
    email: string;
    address: string;
    depHead?: Employee;
}


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
    faculties: Faculty[];
    setFaculties: (faculties: Faculty[] | ((prev: Faculty[]) => Faculty[])) => void;
    departments: Department[];
    setDepartments: (departments: Department[] | ((prev: Department[]) => Department[])) => void;
    employee: Employee[];
    setEmployee: (employee: Employee[] | ((prev: Employee[]) => Employee[])) => void;
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
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [departments, setDepartments] = useState<Department[]>([{
        name: 'Информатика',
        phone: '+3759927661788',
        email: 'eugheu@nf.ssa',
        address: 'dwdawdawd',
    }])
    const [employee, setEmployee] = useState<Employee[]>([])

    return (
        <UniversityFormContext.Provider value={{
            contacts, setContacts,
            xPer, setXPer,
            fullName, setFullName,
            shortName, setShortName,
            description, setDescription,
            address, setAddress,
            image, setImage,
            faculties, setFaculties,
            departments, setDepartments,
            employee, setEmployee
        }}>
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
