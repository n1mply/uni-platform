'use client'

import FloatingInput from "./FloatingInput";
import { useState, useEffect } from "react";
import { useUniversityForm } from "../(context)/UniversityFormContext";
import { Department } from "../(context)/UniversityFormContext";
import { AtSign, Smartphone, MapPinHouse, ContactRound, BookOpen, X, ChevronRight, MapPin } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Некорректный email");
const phoneSchema = z
    .string()
    .min(10, "Телефон должен содержать минимум 10 цифр")
    .regex(/^[0-9+\-() ]+$/, "Некорректный номер телефона");

export default function DepartmentForm() {
    const { xPer, setXPer } = useUniversityForm()
    const { departments, setDepartments } = useUniversityForm()

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [unactive, setUnactive] = useState(true)

    const updateDepartments = () => {
        const valPhone = phoneSchema.safeParse(phone)
        const valEmail = emailSchema.safeParse(email)
        if (valEmail.success && valPhone.success && name && address) {
            const newDapartment: Department = {
                name: name,
                phone: phone,
                email: email,
                address: address,
            }
            setDepartments((prevDepartments) => [...prevDepartments, newDapartment]);
            setName('')
            setPhone('')
            setEmail('')
            setAddress('')
        }
        else {
            console.error("Validation failed:", {
                email: valEmail.success,
                phone: valPhone.success,
                name: !!name,
                address: !!address
            });
        }
    }

    const skipStep = () => {
        setDepartments([])
        setXPer(xPer + 1)
    }

    const nextStep = () => {
        setXPer(xPer + 1)
    }

    const deleteDepartment = (index: number) => {
        setDepartments(prevDepartments =>
            prevDepartments.filter((_, i) => i !== index)
        );
    };

    useEffect(() => {
        const validateDepartments = async () => {
            if (departments.length >= 1) {
                setUnactive(false)
            }
            else {
                setUnactive(true)
            }
        }

        validateDepartments()
    }, [departments])

    return (
        <div className="w-screen flex flex-col lg:flex-row lg:gap-[100px] px-4">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-left font-bold text-gray-900 mb-4 lg:mb-6">Кафедры</h1>
                <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 text-left mt-4 lg:mt-15">
                    Кафедра может отвечать за несколько специальностей сразу и быть в нескольких факультетах
                </p>
                
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Название кафедры'}
                    type={'text'}
                    value={name}
                    onChange={e => setName(e)}
                    className="relative w-full lg:max-w-2xl mb-4 lg:mb-6"
                />
                
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`phone`}
                    label={'Телефон'}
                    type={'tel'}
                    value={phone}
                    onChange={e => setPhone(e)}
                    className="relative w-full lg:max-w-2xl mb-4 lg:mb-6"
                />
                
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`email`}
                    label={'Адрес электронной почты'}
                    type={'email'}
                    value={email}
                    onChange={e => setEmail(e)}
                    className="relative w-full lg:max-w-2xl mb-4 lg:mb-6"
                />
                
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`adres`}
                    label={'Адрес'}
                    type={'text'}
                    value={address}
                    onChange={e => setAddress(e)}
                    className="relative w-full lg:max-w-2xl mb-4 lg:mb-6"
                />
                
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`head`}
                    label={'Заведующий кафедрой'}
                    type={'text'}
                    value={''}
                    disabled
                    onChange={() => updateDepartments()}
                    className="relative w-full lg:max-w-2xl mb-4 lg:mb-6"
                />
                
                <p className="text-s lg:text-sm text-gray-600 text-left mb-4">
                    Сотрудники пока не созданы, скоро Вы сможете это сделать
                </p>
                
                <button
                    tabIndex={xPer !== 3 ? -1 : 0}
                    onClick={() => updateDepartments()}
                    className={`w-full lg:max-w-2xl mt-2 mb-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block`}
                >
                    Добавить кафедру
                </button>
                
                <p className="text-s lg:text-sm text-gray-600 text-left mb-4">
                    Вы можете пропустить этот этап и создать кафедры позже, в админ-панели
                </p>
                
                <div className="w-full lg:max-w-2xl flex flex-col sm:flex-row justify-center items-center gap-2">
                    <button
                        tabIndex={xPer !== 3 ? -1 : 0}
                        onClick={() => skipStep()}
                        disabled={!unactive}
                        className={`w-full sm:w-1/2 lg:max-w-2xl mt-2 mb-2 ${!unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${!unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${!unactive ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'} transition text-center block`}
                    >
                        Пропустить
                    </button>
                    <button
                        tabIndex={xPer !== 3 ? -1 : 0}
                        onClick={() => nextStep()}
                        disabled={unactive}
                        className={`w-full sm:w-1/2 lg:max-w-2xl mt-2 mb-2 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'} transition text-center block`}
                    >
                        Далее
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-1/2">
                <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 text-left mt-4 lg:mt-15">
                    Предпросмотр. Здесь появятся созданные вами кафедры
                    для препросмотра его карточки
                </p>
                
                <div className={`h-auto lg:h-[500px] ${departments.length === 0 ? 'lg:overflow-y-auto' : 'lg:overflow-y-scroll'} mb-8 lg:mb-0`}>
                    {departments.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full py-8 lg:py-0">
                            <BookOpen color="#4a5565" size={98} className="mx-auto" />
                            <p className="text-base lg:text-lg text-gray-600 mb-8 text-center mt-3">Список кафедр пока пуст</p>
                        </div>
                    ) : (
                        departments.map((d, i) => (
                            <div
                                key={i}
                                className="bg-white relative rounded-lg shadow-sm border mb-4 border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-4 pb-2 border-b border-gray-100">
                                    {d.name}
                                </h3>

                                <div className="mb-3">
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <ContactRound className="w-4 h-4 mr-2 text-gray-500" />
                                        Контакты
                                    </div>
                                    <div className="space-y-1 ml-6">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Smartphone className="w-4 h-4 mr-2 text-gray-400" />
                                            {d.phone}
                                        </div>
                                        <a
                                            href={`mailto:${d.email}`}
                                            tabIndex={xPer !== 3 ? -1 : 0}
                                            className="flex items-center text-sm text-gray-600 hover:text-blue-500 transition-colors"
                                        >
                                            <AtSign className="w-4 h-4 mr-2 text-gray-400" />
                                            {d.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                        Адрес
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6 text-left">{d.address}</p>
                                </div>

                                <div className="mb-2">
                                    <div className="flex items-center text-sm text-left font-medium text-gray-700 mb-1">
                                        <ContactRound className="w-4 h-4 mr-2 text-gray-500" />
                                        Заведующий кафедрой
                                    </div>
                                    <div className="flex items-center text-sm text-blue-600 ml-6 group">
                                        <span className="text-left">{'Доцент, кандидат технических наук Трохова Татьяна Анатольевна'}</span>
                                        <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <button 
                                    tabIndex={xPer !== 3 ? -1 : 0} 
                                    onClick={() => deleteDepartment(i)} 
                                    className="absolute top-4 right-4"
                                >
                                    <X />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}