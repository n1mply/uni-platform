'use client'

import FloatingInput from "./FloatingInput"
import SmartSelect from "./SmartSelect"
import DragNDrop from "./DragNDrop"
import { useState, useEffect } from "react"
import { useUniversityForm, Employee } from "../(context)/UniversityFormContext"
import { BookOpen, Cat, School, User } from "lucide-react"

export default function EmployeeForm() {
    const { xPer, setXPer } = useUniversityForm()
    const { employee, setEmployee } = useUniversityForm()
    const { departments, setDepartments } = useUniversityForm()
    const { image, setImage } = useUniversityForm()

    const [fullName, setFullName] = useState('')
    const [position, setPosition] = useState('Ректор')
    const [academicDegree, setAcademicDegree] = useState('')
    const [department, setDepartment] = useState('')

    const [enabled, setEnabled] = useState(false);
    const [unactive, setUnactive] = useState(true)
    const departmentNames: string[] = []

    departments.forEach(item => {
        departmentNames.push(item.name)
    });

    useEffect(() => {
        const checkForRector = () => {
            const hasRector = employee.some(emp =>
                emp.position.toLowerCase().includes('ректор')
            );

            setUnactive(!hasRector);
        };

        checkForRector();
    }, [employee]);

    const updateEmployee = () => {
        if (fullName.split(' ').length >= 3 && position) {
            const newEmployee: Employee = {
                fullName: fullName.trim(),
                position: position.trim(),
                academicDegree: academicDegree.trim(),
            };

            if (image) {
                newEmployee.photoURL = {
                    name: image.name || `employee_${Date.now()}`,
                    url: image.url
                };
            }

            if (department) {
                newEmployee.isDepHead = true;

                setDepartments(prevDepartments =>
                    prevDepartments.map(dep => {
                        if (dep.name === department) {
                            return {
                                ...dep,
                                depHead: newEmployee
                            };
                        }
                        return dep;
                    })
                );
            }

            setEmployee(prevEmployees => [...prevEmployees, newEmployee]);
            setFullName('');
            setPosition('');
            setAcademicDegree('');
            setDepartment('');
            setImage(null);

            console.log('Создан сотрудник:', newEmployee);
        } else {
            console.error('Не все обязательные поля заполнены');
        }
    };

    const togleButton = () => {
        setEnabled(!enabled)
        setDepartment('')
    }

    const validateEmployeers = () => {
        if (employee.length >= 1) {
            setXPer(xPer + 1)
        }
        else {

        }
    }


    const positions = [
        "Ректор",
        "Проректор",
        "Проректор по учебной работе",
        "Проректор по научной работе",
        "Проректор по воспитательной работе",
        "Декан",
        "Заместитель декана",
        "Профессор",
        "Доцент",
        "Старший преподаватель",
        "Преподаватель",
        "Ассистент",
        "Ведущий преподаватель",
        "Лаборант",
        "Методист",
        "Куратор группы",
        "Секретарь учёного совета",
        "Научный сотрудник",
        "Старший научный сотрудник",
        "Исследователь",
        "Зав. лабораторией",
        "Начальник учебного управления",
        "Руководитель отдела аспирантуры",
        "Администратор факультета"
    ];


    const degrees = [
        "Степень отсутствует",
        "Кандидат технических наук",
        "Кандидат физико-математических наук",
        "Кандидат химических наук",
        "Доктор технических наук",
        "Доктор физико-математических наук",
    ];

    return (
        <div className="w-screen flex gap-[100px] flex-row text-center px-4">
            <div className="w-1/2">
                <h1 className="text-4xl md:text-5xl text-left absolute font-bold text-gray-900 mb-6">Сотрудники</h1>
                <p className="text-lg text-gray-600 mb-8 text-left mt-15">
                    Добавьте сотрудников, выберите им необходимую
                    специальность в удобном поисковике,
                    наделите научной степенью и даже прикрепите фото(необязательно)
                </p>
                <div className="flex items-start gap-5">
                    <DragNDrop />
                    <p className="text-gray-600 text-left w-2/3 mt-0">
                        Оптицианально можете добавить фотографию сотрудника.
                        Перетащите её сюда или нажмите, чтобы выбрать. Доступен предпросмотр
                    </p>
                </div>
                <FloatingInput
                    tabIndex={xPer !== 0 ? -1 : 0}
                    id={`fullName`}
                    label={'ФИО'}
                    type={'text'}
                    value={fullName}
                    onChange={e => setFullName(e)}
                    className="relative w-full max-w-2xl mb-6"
                />
                <SmartSelect
                    options={positions}
                    id={'positions'}
                    label="Должность"
                    value={position}
                    onChange={(e) => setPosition(e)}
                />
                <SmartSelect
                    options={degrees}
                    id={'positions'}
                    label="Учёная степень"
                    value={academicDegree}
                    onChange={(e) => setAcademicDegree(e)}
                />
                <p className="text-s text-gray-600 text-left mb-3">Воспользуйтесь "умным" полем для поиска, чтобы найти нужнкю должность или научную степень. Вы также можете вписать своё значение, если его нет в списке</p>
                <div className="flex gap-2 items-center justify-left mb-4">
                    <p className="text-s text-gray-600 text-left">Назначить заведующим кафедры:</p>
                    <button
                        onClick={() => togleButton()}
                        className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
                {enabled ? (
                    <SmartSelect
                        options={departmentNames}
                        label="Кафедра"
                        id={'department'}
                        value={department}
                        onChange={(e) => setDepartment(e)}
                    />
                ) : (<div></div>)}
                <button
                    tabIndex={xPer !== 1 ? -1 : 0}
                    onClick={() => updateEmployee()}
                    className={`w-full max-w-2xl mt-2 mb-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block`}
                >
                    Добавить сотрудника
                </button>
                <p className="text-gray-600 text-left w-2/3 mt-0">
                    Для продолжения, добавьте хотя бы ректора
                </p>
                <button
                    tabIndex={xPer !== 1 ? -1 : 0}
                    onClick={() => validateEmployeers()}
                    disabled={unactive ? true : false}
                    className={`w-full max-w-2xl mb-2 mt-3 ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}  transition text-center block`}
                >
                    Последний шаг
                </button>
                <p className="text-gray-600 text-left w-2/3 mt-0"></p>
            </div>

            <div className="w-1/2">
                <p className="text-lg w-[90%] text-gray-600 mb-8 text-left mt-15">
                    Предпросмотр. Здесь появятся созданные вами сотрудники
                    для препросмотра его карточки
                </p>
                <div className={`h-[500px] ${employee.length === 0 ? 'overflow-y-auto' : 'overflow-y-scroll'} `}>
                    {employee.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full">
                            <Cat color="#4a5565" size={98} className="mx-auto" />
                            <p className="text-lg text-gray-600 mb-8 text-center mt-3">Список сотрудников пока пуст</p>
                        </div>
                    ) : (
                        <div className="space-y-4 p-2">
                            {employee.map((e, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        {e.photoURL && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={e.photoURL.url}
                                                    alt={e.fullName}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg text-left font-semibold text-gray-900">{e.fullName}</h3>
                                            <div className="flex items-center text-sm text-blue-600 mt-4">
                                                <User className="w-4 h-4 mr-2" />
                                                {e.position}
                                            </div>
                                        </div>
                                    </div>

                                    {e.academicDegree && (
                                        <div className="mt-3 flex items-center text-sm text-gray-700">
                                            <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                                            {e.academicDegree}
                                        </div>
                                    )}

                                    {e.isDepHead && departments.find(d => d.depHead?.fullName === e.fullName) && (
                                        <div className="mt-3 flex items-center text-sm text-gray-700">
                                            <School className="w-4 h-4 mr-2 text-gray-500" />
                                            <span className="font-medium">Заведующий кафедрой: </span>
                                            <span className="ml-1 text-gray-600">
                                                {departments.find(d => d.depHead?.fullName === e.fullName)?.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}