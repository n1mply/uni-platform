'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import generateTag from "../(hooks)/generateTag";

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
    tag: string;
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
    universityTag: string;
    setUniversityTag: (universityTag: string) => void;
    generatedPassword: string;
    setGeneratedPassword: (generatedPassword: string) => void;
};


type University = {
    baseInfo: {
        fullName: string;
        shortName: string;
        description: string;
        address: string;
        image: ImageState;
        universityTag: string;
        contacts: Contact[];
    };
    structure: {
        faculties: Faculty[];
        departments: Department[];
    };
    employees: Employee[];
    credentials: {
        generatedPassword: string;
    };
    meta?: {
        createdAt?: Date;
        updatedAt?: Date;
    };
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
    const [departments, setDepartments] = useState<Department[]>([])
    const [employee, setEmployee] = useState<Employee[]>([])
    const [universityTag, setUniversityTag] = useState<string>("");
    const [generatedPassword, setGeneratedPassword] = useState("");

    useMemo(() => {
        if (fullName) {
            const tag = generateTag(fullName) || "";
            setUniversityTag(tag);
        }
    }, [fullName]);

    const value = useMemo(() => ({
        contacts, setContacts,
        xPer, setXPer,
        fullName, setFullName,
        shortName, setShortName,
        description, setDescription,
        address, setAddress,
        image, setImage,
        faculties, setFaculties,
        departments, setDepartments,
        employee, setEmployee,
        universityTag, setUniversityTag,
        generatedPassword, setGeneratedPassword
    }), [
        contacts, xPer, fullName, shortName,
        description, address, image, faculties,
        departments, employee, universityTag, generatedPassword
    ]);

    return (
        <UniversityFormContext.Provider value={value}>
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
