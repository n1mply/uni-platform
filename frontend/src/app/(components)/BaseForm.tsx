'use client';

import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import FloatingInput from "@/app/(components)/FloatingInput";
import { useEffect, useState } from "react";
import MessageAlert from "./CustomAlert";


export default function BaseForm() {
    const { fullName, setFullName } = useUniversityForm();
    const { shortName, setShortName } = useUniversityForm();
    const { address, setAddress } = useUniversityForm();
    const { description, setDescription } = useUniversityForm();
    const { xPer, setXPer } = useUniversityForm();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [unactive, setUnactive] = useState(true)

    const handleContinue = () => {
        const errors: string[] = [];
        const baseInfo = [
            fullName,
            shortName,
            address,
            description
        ]

        if (fullName && shortName && address && description.length >= 60) {
            setXPer(xPer + 1)
        }

        baseInfo.forEach((info, index) => {
            if (!info && index === 0) {
                errors.push('Укажите полное название ВУЗа')
            }
            if (!info && index === 1) {
                errors.push('Дайте ВУЗу краткое название')
            }
            if (!info && index === 2) {
                errors.push('Укажите адресс (например: 246746, Республика Беларусь, г. Гомель, пр-т Декабря, 62, корпус 2, каб. 351)')
            }
            if (index === 3 && info.length<60) {
                errors.push('Опишите ВУЗ подробнее (60+ символов)')
            }
        })

        setErrorMessages(errors)
    }


    useEffect(() => {
        const validateBaseInfo = async () => {
            if (fullName && shortName && address && description.length >= 60) {
                setUnactive(false)
            }
        }
        validateBaseInfo()
    }, [fullName, shortName, address, description])

    return (
        <div className="w-screen flex flex-col text-center px-4 scale-[0.9]">
            <div className="border border-blue-400 mx-auto p-4 px-10 rounded-md">
                <h1 className="text-4xl text-left md:text-5xl max-w-2xl w-full mx-auto font-bold text-gray-900 mb-6">Давайте начнём</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl w-full mx-auto text-left">
                    Добавьте базовую информацию о высшем учебном заведении
                </p>

                <MessageAlert messages={errorMessages}/>

                <FloatingInput
                    id="fullName"
                    label="Полное название ВУЗа"
                    value={fullName}
                    onChange={setFullName}
                    required
                    tabIndex={xPer !== 1 ? -1 : 0}
                    className="relative w-full max-w-2xl mx-auto mb-6"
                />
                <FloatingInput
                    id="shortName"
                    label="Сокращённое название"
                    value={shortName}
                    onChange={setShortName}
                    required
                    tabIndex={xPer !== 0 ? -1 : 0}
                    className="relative w-full max-w-2xl mx-auto mb-6"
                />
                <FloatingInput
                    id="address"
                    label="Полный адрес"
                    value={address}
                    onChange={setAddress}
                    tabIndex={xPer !== 0 ? -1 : 0}
                    className="relative w-full max-w-2xl mx-auto mb-6"
                />
                <div className="relative w-full max-w-2xl mx-auto mb-6">
                    <textarea
                        id="description"
                        rows={4}
                        value={description}
                        tabIndex={xPer !== 0 ? -1 : 0}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`peer block w-full border border-gray-300 rounded px-4 pt-8 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 resize-none`}
                        placeholder=" "
                        minLength={60}
                        maxLength={300}
                    />
                    <label
                        htmlFor="description"
                        className={`absolute left-4 transition-all duration-200 bg-white px-1
                        ${description
                                ? 'top-2 text-sm text-blue-600'
                                : 'top-4 text-base text-gray-400'
                            }
                        peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
                        `}
                    >
                        Описание
                    </label>
                </div>


                <button
                    onClick={() => handleContinue()}
                    tabIndex={xPer !== 0 ? -1 : 0}
                    className={`w-full max-w-2xl mb-2 mx-auto mt-10 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} cursor-pointer  transition text-center block`}
                >
                    Далее
                </button>
            </div>
        </div>
    )
}