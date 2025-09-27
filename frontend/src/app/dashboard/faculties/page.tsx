'use client'
import { useState, useRef, useEffect } from 'react'
import FloatingInput from '@/app/(components)/FloatingInput'
import SmartSelect from '@/app/(components)/SmartSelect'
import { useAlertContext } from "@/app/(context)/AlertContext";
import { ImageState } from '../(context)/UniversityFormContext';
import DragNDrop from "@/app/(components)/DragNDrop";
import { Plus } from 'lucide-react';

interface Faculty {
    name: string;
    tag: string;
    icon_path: string;
}

export default function FaculiesCreatePage({ }) {
    const [icon, setIcon] = useState<ImageState>()
    const [addFaculty, setAddFaculty] = useState(false)
    const [facultyTag, setFacultyTag] = useState('')
    const [name, setName] = useState('')


    const handleCreate = async () => {
        return 0
    }

    const handleClose = async () =>{
        setAddFaculty(false)
        setFacultyTag('')
        setName('')
        setIcon(null)
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Факультеты</h1>

            <div className='mb-6'>
                <button
                    onClick={() => setAddFaculty(!addFaculty)}
                    className="w-full sm:w-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.97] duration-300">
                    <Plus />
                    <span className="ml-2">Добавить</span>
                </button>
            </div>

            {addFaculty && (
                <div className="border border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex flex-col  gap-4">
                        <div className='flex gap-4'>
                            <div className="flex flex-col mb-6">
                                <p className="mb-2 text-sm text-gray-600">Иконка факультета</p>
                                <DragNDrop image={icon} setImage={setIcon} proportion={true} height='200px' />
                            </div>
                            <div className='flex flex-col mt-7 w-full'>
                                <FloatingInput
                                    id="name"
                                    label="Название факультета"
                                    value={name}
                                    onChange={setName}
                                    className="relative mb-6 w-full"
                                    maxLength={100}
                                />
                                <FloatingInput
                                    id="tag"
                                    label="Тег факультета"
                                    value={facultyTag}
                                    onChange={setFacultyTag}
                                    className="relative mb-2 w-full"
                                    maxLength={100}
                                />
                                <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
                                    После создания ваша специальность получит адрес типа <strong>example.uniplatform.by/faculty/{facultyTag || "tag"}</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2 mt-4">
                            <button
                                onClick={() => handleClose()}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => handleCreate()}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}

                <p>Совершенно другой контент для теста</p>
        </>
    )
}