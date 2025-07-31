'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BriefcaseBusiness, Save, Trash2, X } from 'lucide-react';
import FloatingInput from './FloatingInput';
import { Department, DepartmentEditData, Faculty } from '../dashboard/departments/page';

type DepartmentEditModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialData?: DepartmentEditData;
    onSave: (data: DepartmentEditData) => void;
    onDelete?: () => void;
};

const emptyDepartment: Department = {
    id: -1,
    name: '',
    address: '',
    phone: '',
    email: '',
    head_id: -1,
};

export default function DepartmentEditModal({
    isOpen,
    onClose,
    initialData,
    onSave,
    onDelete,
}: DepartmentEditModalProps) {
    // Инициализируем с пустыми значениями
    const [formData, setFormData] = useState<DepartmentEditData>({
        department: emptyDepartment,
        faculties: [],
    });

    // Инициализация формы initialData
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                department: emptyDepartment,
                faculties: [],
            });
        }
    }, [initialData]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleDepartmentChange = (field: keyof Department) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            department: {
                ...prev.department,
                [field]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Изменить</h2>
                        <p className="text-sm text-gray-500">
                            Здесь вы можете отредактировать или удалить кафедру
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <FloatingInput
                                id="name"
                                label="Название кафедры"
                                type="text"
                                value={formData.department.name}
                                onChange={handleDepartmentChange('name')}
                                required
                            />

                            <FloatingInput
                                id="address"
                                label="Адрес"
                                type="text"
                                value={formData.department.address}
                                onChange={handleDepartmentChange('address')}
                                required
                            />

                            <FloatingInput
                                id="phone"
                                label="Телефон"
                                type="tel"
                                value={formData.department.phone}
                                onChange={handleDepartmentChange('phone')}
                                required
                            />

                            <FloatingInput
                                id="email"
                                label="Эл. почта"
                                type="email"
                                value={formData.department.email}
                                onChange={handleDepartmentChange('email')}
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                            Факультеты:
                        </p>
                        {formData.faculties.map((faculty) => (
                            <div
                                key={faculty.id}
                                className="flex items-center bg-white relative rounded-lg shadow-sm border mb-4 border-gray-200 p-4 hover:shadow-md transition-shadow"
                            >
                                {/* <div className="w-16 h-16 flex-shrink-0 mr-4">
                                    <img src={f.iconURL?.url} alt={f.name} width={64} height={64} className="rounded" />
                                </div> */}
                                <div className="flex-1 text-left">
                                    <h1 className="text-xs lg:text-sm">{faculty.name}</h1>
                                    <p className="text-blue-600 text-xs lg:text-sm">@{faculty.tag}</p>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-xs lg:text-sm text-gray-500">-/- специальности</p>
                                    </div>
                                </div>
                                <button className='hover:scale-[1.1] transition-all duration-300'>
                                    <X />
                                </button>
                            </div>
                        ))}

                        <div className="mt-6 flex justify-between gap-2 flex-wrap w-full">
                            <button
                                type="submit"
                                className="active:scale-[0.97] flex w-full justify-center gap-1 font-medium items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all duration-200"
                            >
                                <Save className="" />
                                Сохранить
                            </button>
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onDelete();
                                        onClose();
                                    }}
                                    className="active:scale-[0.97] flex w-full justify-center gap-1 font-medium items-center px-4 py-2 bg-gray-300 text-gray-900 text-sm rounded-md hover:bg-gray-400 transition-all duration-200  "
                                >
                                    <Trash2 className="" />
                                    Удалить
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}