'use client'
import { useState, useRef, useEffect } from 'react'
import FloatingInput from '@/app/(components)/FloatingInput'
import SmartSelect from '@/app/(components)/SmartSelect'
import { useAlertContext } from "@/app/(context)/AlertContext";
import { ImageState } from '../(context)/UniversityFormContext';
import DragNDrop from "@/app/(components)/DragNDrop";

interface Faculty {
    name: string;
    tag: string;
    icon_path: string;
}

export default function FaculiesCreatePage({ }) {
    const [icon, setIcon] = useState<ImageState>()
    const [isActive, setIsActive] = useState(false)
    const [facultyTag, setFacultyTag] = useState('')
    const [name, setName] = useState('')


    return (
        <>
            <div className='flex justify-center items-center w-full h-[80vh]'>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Упс, кажется здесь ничего нет и не будет))</h1>
            </div>
        </>
    )
}