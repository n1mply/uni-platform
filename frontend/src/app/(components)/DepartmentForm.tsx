'use client'

import FloatingInput from "./FloatingInput";
import { useState, useEffect } from "react";
import { useUniversityForm } from "../(context)/UniversityFormContext";
import { AtSign, Smartphone, MapPinHouse, ContactRound, BookOpen, X, ChevronRight, MapPin } from "lucide-react";
import { Department } from "../(context)/UniversityFormContext";
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
        <div className="w-screen flex gap-[100px] flex-row text-center px-4">
            <div className="w-1/2">
                <h1 className="text-4xl md:text-5xl text-left absolute font-bold text-gray-900 mb-6">Кафедры</h1>
                <p className="text-lg w-[73%] text-gray-600 mb-8 text-left mt-15">
                    Кафедра может отвечать за несколько специальностей сразу и быть в нескольких факультетах
                </p>
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Название кафедры'}
                    type={'text'}
                    value={name}
                    onChange={e => setName(e)}
                    className="relative w-full max-w-2xl mb-6"
                />
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Телефон'}
                    type={'tel'}
                    value={phone}
                    onChange={e => setPhone(e)}
                    className="relative w-full max-w-2xl mb-6"
                />
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Адрес электронной почты'}
                    type={'email'}
                    value={email}
                    onChange={e => setEmail(e)}
                    className="relative w-full max-w-2xl mb-6"
                />
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Адресс'}
                    type={'text'}
                    value={address}
                    onChange={e => setAddress(e)}
                    className="relative w-full max-w-2xl mb-6"
                />
                <FloatingInput
                    tabIndex={xPer !== 3 ? -1 : 0}
                    id={`name`}
                    label={'Заведующий кафедрой'}
                    type={'text'}
                    value={''}
                    disabled
                    onChange={() => updateDepartments()}
                    className="relative w-full max-w-2xl mb-6"
                />
                <p className="text-s text-gray-600 text-left">
                    Сотрудники пока не созданы, скоро Вы сможете это сделать
                </p>
                <button
                    tabIndex={xPer !== 1 ? -1 : 0}
                    onClick={() => updateDepartments()}
                    className={`w-full max-w-2xl mt-2 mb-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block`}
                >
                    Добавить кафедру
                </button>
                <p className="text-s text-gray-600 text-left">Вы можете пропустить этот этап и создать кафедры, позже, в админ-панели</p>
                <div className="w-full max-w-2xl flex justify-center items-center gap-2">
                    <button
                        tabIndex={xPer !== 1 ? -1 : 0}
                        onClick={() => skipStep()}
                        disabled={unactive ? false : true}
                        className={`w-1/2 max-w-2xl mt-2 mb-2  ${!unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${!unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${!unactive ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'} transition text-center block`}
                    >
                        Пропустить
                    </button>
                    <button
                        tabIndex={xPer !== 1 ? -1 : 0}
                        onClick={() => nextStep()}
                        disabled={unactive ? true : false}
                        className={`w-1/2 max-w-2xl mt-2 mb-2  ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}  transition text-center block`}
                    >
                        Далее
                    </button>
                </div>
            </div>
            <div className="w-1/2">
                <p className="text-lg w-[89%] text-gray-600 mb-8 text-left mt-15">
                    Предпросмотр. Здесь появятся созданные вами кафедры
                    для препросмотра его карточки
                </p>
                <div className={`h-[500px] ${departments.length === 0 ? 'overflow-y-auto' : 'overflow-y-scroll'} `}>
                    {departments.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full">
                            <BookOpen color="#4a5565" size={98} className="mx-auto" />
                            <p className="text-lg text-gray-600 mb-8 text-center mt-3">Список кафедр пока пуст</p>
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

                                <button onClick={() => deleteDepartment(i)} className="absolute top-4 right-4">
                                    <X />
                                </button>
                            </div>
                        )))
                    }
                </div>
            </div>
        </div>
    )
}