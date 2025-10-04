/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useAlertContext } from "@/app/(context)/AlertContext"
import { AtSign, Book, MapPin, Smartphone, Users, School, Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react"
import DepartmentEditModal from "@/app/(components)/DepartmentEditModal";
import FloatingInput from "@/app/(components)/FloatingInput";
import SmartSelect from "@/app/(components)/SmartSelect";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";


const emailSchema = z.string().email("Некорректный email");
const phoneSchema = z
    .string()
    .min(10, "Телефон должен содержать минимум 10 цифр")
    .regex(/^[0-9+\-() ]+$/, "Некорректный номер телефона");

export interface Employee {
    full_name: string;
    position: string;
    is_dep_head: boolean;
    department_id: number;
    id: number;
    academic_degree: string;
    photo_path: string;
    university_id: number;
}

export interface Department {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    head_id: number;
}

export interface Faculty {
    id: number;
    name: string;
    tag: string;
    icon_path: string;
}

export interface DepartmentEditData {
    department: Department;
    faculties: Faculty[];
    employees: Employee[];
}

export default function DepartmentsPage({ }) {
    const router = useRouter();
    const { showAlert, hideAlert } = useAlertContext()

    const [name, setName] = useState('')
    const [adress, setAdress] = useState('')
    const [phone, setPhone] = useState('+375 ')
    const [email, setEmail] = useState('')

    const [newEmployee, setNewEmployee] = useState('')
    const [freeEmployees, setFreeEmployees] = useState<Employee[]>([])

    const [addDepartment, setAddDepartment] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [departments, setDepartments] = useState<Department[]>([])
    const [allDepartments, setAllDepartments] = useState<Department[]>([])

    const [employees, setEmployees] = useState<Employee[]>([])
    const [facultyRelations, setFacultyRelations] = useState<Record<number, Faculty[]>>({})

    const searchInputRef = useRef<HTMLInputElement>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout>()
    const [currentDepartment, setCurrentDepartment] = useState<DepartmentEditData>();

    const handleSave = async (data: any, employee: any) => {
        try {
            const head_id = freeEmployees.find((emp) => (emp.full_name === employee))
            const payload = {
                name: data.department.name,
                address: data.department.address,
                phone: data.department.phone,
                email: data.department.email,
                head_id: head_id ? head_id.id : null
            }
            console.log(payload)

            const response = await fetch(`/api/department/update/base/${data.department.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                showAlert(["Сохранено успешно!"], false);
                // location.reload()
                // console.log("Сохранено:", data);
            } else {
                showAlert(["Ошибка при обновлении кафедры"]);
            }
            setIsModalOpen(false);
        }
        catch {

        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/department/delete/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                showAlert(["Удалено успешно"], false);
                location.reload()
                console.log("Удалено:", data);
            } else {
                showAlert(["Ошибка при удалении кафедры"]);
            }
            setIsModalOpen(false);
        }
        catch {

        }
    };


    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setDepartments(allDepartments)
            return
        }

        const filtered = allDepartments.filter(department =>
            department.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setDepartments(filtered)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        if (!value.trim()) {
            setDepartments(allDepartments)
            return
        }


        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }


        searchTimeoutRef.current = setTimeout(() => {
            handleSearch()
        }, 500)
    }

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const response = await fetch(`/api/department/get/all`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setDepartments(data.data)
                    setAllDepartments(data.data)
                    fetchFacultyRelations(data.data.map((d: Department) => d.id))
                } else {
                    showAlert(["Ошибка при получении кафедры"]);
                }
            } catch {
                showAlert(["Ошибка при получении кафедры"]);
            }
        }
        getDepartments()
    }, [router, showAlert])

    useEffect(() => {
        const getEmployeeHeads = async () => {
            try {
                const response = await fetch(`/api/employee/get/heads`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data.data)
                } else {
                    showAlert(["Нет заведующих кафедрами"]);
                }
            } catch {
                showAlert(["Ошибка при получении заведующих кафедрой"]);
            }
        }
        getEmployeeHeads()
    }, [router, showAlert])

    const fetchFacultyRelations = async (departmentIds: number[]) => {
        try {
            const facultyRelations: Record<number, Faculty[]> = {};

            await Promise.all(departmentIds.map(async (id) => {
                const response = await fetch(`/api/faculty/get/relations/department/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    facultyRelations[id] = data;
                } else {
                    facultyRelations[id] = [];
                }
            }));

            setFacultyRelations(facultyRelations);
        } catch (error) {
            console.error("Ошибка при получении факультетов:", error);
            const emptyRelations = departmentIds.reduce((acc, id) => {
                acc[id] = [];
                return acc;
            }, {} as Record<number, Faculty[]>);
            setFacultyRelations(emptyRelations);
        }
    }
    const getDepartmentHead = (departmentId: number, departmentHeadId: number) => {
        if (departmentHeadId) {
            const headById = employees.find(emp => emp.id === departmentHeadId);
            if (headById) return headById;
        }

        return employees.find(emp =>
            emp.department_id === departmentId && emp.is_dep_head
        );
    }

    useEffect(() => {
        const getFreeEmployees = async () => {
            const response = await fetch('/api/employee/get/free', {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json();
                setFreeEmployees(data.data)
            } else {
                showAlert(['Список сотрудников пуст'])
            }
        }
        getFreeEmployees()
    }, [])

    const handleCreate = async () => {
        const errors: string[] = [];

        // Валидация названия кафедры
        if (name.length <= 3) {
            errors.push('Название кафедры должно быть длиннее 3 символов');
        }

        // Валидация телефона и email с помощью zod
        try {
            phoneSchema.parse(phone.replace(/[^0-9]/g, ''));
            emailSchema.parse(email);
        } catch (error) {
            if (error instanceof z.ZodError) {
                errors.push(...error.errors.map(err => err.message));
            } else {
                errors.push('Произошла неизвестная ошибка при валидации');
            }
        }

        // Валидация адреса
        if (adress.length <= 60) {
            errors.push('Введите более точный адрес (минимум 60 символов)');
        }

        // Валидация выбора сотрудника (только если newEmployee не пустая строка)
        if (newEmployee && !freeEmployees.some(employee => employee.full_name === newEmployee)) {
            errors.push('Пожалуйста, выберите сотрудника из списка');
        }

        if (errors.length > 0) {
            showAlert(errors);
            return;
        }

        try {
            // Находим ID сотрудника только если он выбран
            const current_head_id = newEmployee
                ? freeEmployees.find(employee => employee.full_name === newEmployee)?.id
                : undefined;

            const payload = {
                name: name,
                phone: phone,
                email: email,
                address: adress,
                head_id: current_head_id // может быть undefined
            };

            // Удаляем head_id из payload, если он undefined (опционально)
            if (payload.head_id === undefined) {
                delete payload.head_id;
            }

            const response = await fetch('/api/department/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showAlert(['Кафедра успешно создана!'], false);
                location.reload();
            } else {
                const errorData = await response.json().catch(() => ({}));
                showAlert([errorData.message || 'Не удалось создать кафедру']);
            }
        } catch (error) {
            showAlert(['Произошла ошибка при отправке данных']);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800">Кафедры</h1>
            <DepartmentEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={currentDepartment}
                onSave={handleSave}
                onDelete={handleDelete}
            />
            <div className="mb-6 w-full">
                <p className="text-sm text-gray-600 w-full sm:w-2/3">Кафедра может отвечать за несколько специальностей сразу и быть в нескольких факультетах.</p>
                <p className="text-sm text-gray-600 w-full sm:w-2/3">Нажмите на кафедру, чтобы начать её редактировать или удалить, вы также можете создать новую кафедру.</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-0 mb-6">
                <div className="flex items-center gap-2 w-full sm:w-[40%] justify-between flex-wrap">
                    <div className="relative flex-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                            placeholder="Поиск по названию кафедры"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.97] duration-300 cursor-pointer flex items-center justify-center"
                        aria-label="Найти"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                <div className="w-full sm:w-auto">
                    <button
                        onClick={() => setAddDepartment(!addDepartment)}
                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.97] duration-300"
                    >
                        <Plus />
                        <span className="ml-2">Добавить</span>
                    </button>
                </div>
            </div>

            {/* 🔽 Анимированный блок */}
            <AnimatePresence>
                {addDepartment && (
                    <motion.div
                        key="add-department"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/2">
                                    <p className="text-gray-900 w-full mb-5">Основная информация</p>
                                    <div className="grid grid-cols-1 gap-4 mb-5">
                                        <FloatingInput
                                            id="name"
                                            label="Название кафедры"
                                            value={name}
                                            onChange={(val) => setName(val)}
                                            className="relative"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                        <FloatingInput
                                            id="email"
                                            label="Почта"
                                            value={email}
                                            onChange={(val) => setEmail(val)}
                                            className="relative"
                                        />
                                        <FloatingInput
                                            id="phone"
                                            label="Номер телефона"
                                            value={phone}
                                            type="tel"
                                            onChange={(val) => setPhone(val)}
                                            className="relative"
                                        />
                                    </div>

                                    <FloatingInput
                                        id="adress"
                                        label="Адрес"
                                        value={adress}
                                        onChange={(val) => setAdress(val)}
                                        className="relative"
                                    />
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <p className="text-gray-900 w-full mb-5">Расширить кафедру</p>
                                    <SmartSelect
                                        options={freeEmployees.map((employee) => employee?.full_name)}
                                        value={newEmployee}
                                        onChange={(option) => setNewEmployee(option)}
                                        id="employees"
                                        label="Заведующий кафедрой"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setAddDepartment(false)}
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
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="relative">
                {departments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {searchQuery ? "Ничего не найдено" : "Кафедры не загружены или отсутствуют :("}
                        </p>
                        {searchQuery ? (
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    setDepartments(allDepartments)
                                }}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                                Сбросить поиск
                            </button>
                        ) : (
                            <button
                                className="cursor-pointer mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.97] duration-300"
                            >
                                Создать кафедру
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900">
                        <div className="flex space-x-4">
                            {departments.map((department) => {
                                const departmentHead = getDepartmentHead(department.id, department.head_id);
                                const faculties = facultyRelations[department.id] || [];
                                const facultyCount = faculties.length;
                                const employeesList: Employee[] = freeEmployees

                                return (
                                    <div
                                        key={department.id}
                                        onClick={() => {
                                            console.log(department)
                                            console.log(employeesList)
                                            setCurrentDepartment(
                                                {
                                                    department: department,
                                                    faculties: faculties,
                                                    employees: employeesList
                                                }
                                            )
                                            setIsModalOpen(true)
                                        }}
                                        className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all active:scale-[0.97] duration-300 cursor-pointer"
                                    >
                                        <div className="p-5">
                                            <div className="flex items-center mb-4">
                                                <Book className="h-5 w-5 text-blue-600 mr-2" />
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {department.name}
                                                </h2>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start text-wrap">
                                                    <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                                                    <p className="text-gray-600 text-sm ">{department.address}</p>
                                                </div>

                                                <div className="flex items-center">
                                                    <Smartphone className="h-4 w-4 text-gray-500 mr-2" />
                                                    <a
                                                        href={`tel:${department.phone}`}
                                                        className="text-blue-600 text-sm hover:underline"
                                                    >
                                                        {department.phone}
                                                    </a>
                                                </div>

                                                <div className="flex items-center">
                                                    <AtSign className="h-4 w-4 text-gray-500 mr-2" />
                                                    <a
                                                        href={`mailto:${department.email}`}
                                                        className="text-blue-600 text-sm hover:underline truncate"
                                                    >
                                                        {department.email}
                                                    </a>
                                                </div>

                                                <div className="flex items-center pt-2 border-t border-gray-100">
                                                    <School className="h-4 w-4 text-gray-500 mr-2" />
                                                    <p className="text-gray-600 text-sm">
                                                        Специальностей привязано: {facultyCount}
                                                    </p>
                                                </div>

                                                {departmentHead && (
                                                    <div className="flex items-start pt-2 border-t border-gray-100 mt-2">
                                                        <Users className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                                        <div>
                                                            <p className="text-gray-600 text-sm font-medium">
                                                                {departmentHead.full_name}
                                                            </p>
                                                            <p className="text-gray-500 text-xs">
                                                                {departmentHead.position}
                                                                {departmentHead.academic_degree && `, ${departmentHead.academic_degree}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}