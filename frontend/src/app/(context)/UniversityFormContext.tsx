'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
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



    useEffect(() => {
        const createUniversity = async (): Promise<void> => {
            if (xPer >= 3) {
                try {
                    const universityData = {
                        baseInfo: {
                            fullName,
                            shortName,
                            description,
                            address,
                            universityImage: {
                                name: "noname",
                                url: "nourl"
                            },
                            universityTag,
                            contacts
                        },
                        structure: {
                            faculties: [],
                            departments: []
                        },
                        employees: [],
                        credentials: {
                            generatedPassword
                        },
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };


                    console.log("Отправляемые данные:", JSON.stringify(universityData, null, 2));

                    const response = await fetch('/api/auth/signup/university', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(universityData)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Ошибка валидации:", errorData);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('University created successfully:', data);
                } catch (error) {
                    console.error('Error creating university:', error);
                }
            }
        };

        createUniversity();
    }, [xPer, fullName, shortName, description, address, universityTag, contacts, faculties, departments, employee, generatedPassword]);

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
