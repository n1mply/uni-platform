'use client';

import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import FloatingInput from "@/app/(components)/FloatingInput";

export default function BaseForm() {
    const { fullName, setFullName } = useUniversityForm();
    const { shortName, setShortName } = useUniversityForm();
    const { address, setAddress } = useUniversityForm();
    const { description, setDescription } = useUniversityForm();
    const { xPer, setXPer } = useUniversityForm();
    return (
        <section className="w-screen flex justify-center flex-col text-center px-4 ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Давайте начнём</h1>
            <p className="text-lg text-gray-600 mb-8">
                Добавьте базовую информацию о высшем учебном заведении
            </p>

            <FloatingInput
                id="fullName"
                label="Полное название ВУЗа"
                value={fullName}
                onChange={setFullName}
                required />
            <FloatingInput
                id="shortName"
                label="Сокращённое название"
                value={shortName}
                onChange={setShortName}
                required />
            <FloatingInput
                id="address"
                label="Полный адрес"
                value={address}
                onChange={setAddress}
            />
            <div className="relative w-full max-w-2xl mx-auto mb-6">
                <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="peer block w-full border border-gray-300 rounded px-4 pt-6 pb-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 resize-none"
                    placeholder=" "
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
                onClick={() => setXPer(-50)}
                className="w-full max-w-2xl mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center block"
            >
                Далее
            </button>
        </section>
    )
}