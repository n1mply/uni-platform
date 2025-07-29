'use client'

import { useAlertContext } from "@/app/(context)/AlertContext"
import { AtSign, BookOpen, MapPin, Smartphone, Users } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"

interface Employee {
    full_name: string;
    position: string;
    is_dep_head: boolean;
    department_id: number;
    id: number;
    academic_degree: string;
    photo_path: string;
    university_id: number;
}

interface Department {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    head_id: number;
}

export default function DepartmentsPage({ }) {
    const router = useRouter();

    const { showAlert, hideAlert } = useAlertContext()
    const [departments, setDepartments] = useState<Department[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])

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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Кафедры</h1>

            <div className="relative">
                <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-900">
                    <div className="flex space-x-4">
                        {departments.map((department) => {
                            const departmentHead = getDepartmentHead(department.id, department.head_id);
                            
                            return (
                                <div
                                    key={department.id}
                                    className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.97]"
                                >
                                    <div className="p-5">
                                        <div className="flex items-center mb-4">
                                            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
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
            </div>
        </>
    )
}