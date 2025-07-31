/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useAlertContext } from "@/app/(context)/AlertContext"
import { AtSign, Book, MapPin, Smartphone, Users, School, Search, Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react"
import DepartmentEditModal from "@/app/(components)/DepartmentEditModal";

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
}

export default function DepartmentsPage({ }) {
    const router = useRouter();
    const { showAlert, hideAlert } = useAlertContext()
    const [departments, setDepartments] = useState<Department[]>([])
    const [allDepartments, setAllDepartments] = useState<Department[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [facultyRelations, setFacultyRelations] = useState<Record<number, Faculty[]>>({})
    const [searchQuery, setSearchQuery] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout>()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentDepartment, setCurrentDepartment] = useState<DepartmentEditData>();

    const handleSave = (data: any) => {
        console.log("Сохранено:", data);
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        console.log("Удалить кафедру с ID:", id);
        setIsModalOpen(false);
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
                    router.push('/');
                }
            } catch {
                showAlert(["Ошибка при получении кафедры"]);
                router.push('/');
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
                    showAlert(["Ошибка при получении заведующих кафедрой"]);
                    router.push('/');
                }
            } catch {
                showAlert(["Ошибка при получении заведующих кафедрой"]);
                router.push('/');
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
                    <button className="w-full sm:w-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-all active:scale-[0.97] duration-300">
                        <Plus />
                        <span className="ml-2">Добавить</span>
                    </button>
                </div>
            </div>


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

                                return (
                                    <div
                                        key={department.id}
                                        onClick={() => {
                                            console.log(department)
                                            setCurrentDepartment(
                                                {
                                                    department,
                                                    faculties
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
                                                <div className="flex items-start">
                                                    <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                                                    <p className="text-gray-600 text-sm">{department.address}</p>
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
                                                        Факультетов привязано: {facultyCount}
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