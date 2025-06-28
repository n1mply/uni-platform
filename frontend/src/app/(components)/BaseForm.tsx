'use client';

import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import FloatingInput from "@/app/(components)/FloatingInput";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function BaseForm() {
    const { fullName, setFullName } = useUniversityForm();
    const { shortName, setShortName } = useUniversityForm();
    const { address, setAddress } = useUniversityForm();
    const { description, setDescription } = useUniversityForm();
    const { xPer, setXPer } = useUniversityForm();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [errorFields, setErrorFields] = useState<boolean[]>([])
    const [unactive, setUnactive] = useState(true)

    const handleContinue = () => {
        const errors: string[] = [];
        const fields: boolean[] = [false, false, false, false];
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
                fields[0]=true
            }
            if (!info && index === 1) {
                errors.push('Дайте ВУЗу краткое название')
                fields[1]=true
            }
            if (!info && index === 2) {
                errors.push('Укажите адресс (например: 246746, Республика Беларусь, г. Гомель, пр-т Декабря, 62, корпус 2, каб. 351)')
                fields[2]=true
            }
            if (!info && index === 3) {
                errors.push('Опишите ВУЗ подробнее (60+ символов)')
                fields[3]=true
            }
        })

        setErrorMessages(errors)
        setErrorFields(fields)
    }


    useEffect(()=>{
        const validateBaseInfo = async()=>{
            if (fullName && shortName && address && description.length >= 60) {
                setUnactive(false)
            }
        }
        validateBaseInfo()
    }, [fullName, shortName, address, description])

    return (
        <section className="w-screen flex justify-center flex-col text-center px-4 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Давайте начнём</h1>
            <p className="text-lg text-gray-600 mb-8">
                Добавьте базовую информацию о высшем учебном заведении
            </p>
            <AnimatePresence>
                {errorMessages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="bg-red-100 text-red-800 p-4 rounded w-full max-w-2xl mx-auto mt-4 mb-7 text-left shadow"
                    >
                        <h2 className="font-bold mb-2">Пожалуйста, исправьте ошибки:</h2>
                        <ul className="list-disc list-inside text-sm space-y-1 w-[75%]">
                            {errorMessages.map((msg, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    {msg}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>


            <FloatingInput
                id="fullName"
                label="Полное название ВУЗа"
                value={fullName}
                onChange={setFullName}
                required
                error={errorFields[0]}
                tabIndex={xPer !== 1 ? -1 : 0} />
            <FloatingInput
                id="shortName"
                label="Сокращённое название"
                value={shortName}
                onChange={setShortName}
                required
                error={errorFields[1]}
                tabIndex={xPer !== 0 ? -1 : 0} />
            <FloatingInput
                id="address"
                label="Полный адрес"
                value={address}
                onChange={setAddress}
                error={errorFields[2]}
                tabIndex={xPer !== 0 ? -1 : 0}
            />
            <div className="relative w-full max-w-2xl mx-auto mb-6">
                <textarea
                    id="description"
                    rows={4}
                    value={description}
                    tabIndex={xPer !== 0 ? -1 : 0}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`peer block w-full border ${!errorFields[3]? "border-gray-300" : "border-red-800"} rounded px-4 pt-8 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 resize-none`}
                    placeholder=" "
                    minLength={60}
                    maxLength={340}
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
        </section>
    )
}