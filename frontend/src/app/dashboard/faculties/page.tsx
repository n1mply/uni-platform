'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Telescope, Edit3, Save, X, Trash2, Plus, GraduationCap, Search, Eye } from 'lucide-react';
import FloatingInput from '@/app/(components)/FloatingInput';
import DragNDrop from '@/app/(components)/DragNDrop';
import { createPortal } from 'react-dom';

// Компонент модального окна
function FacultyModal({ isOpen, onClose, onSubmit }) {
    const [icon, setIcon] = useState(null)
    const [facultyTag, setFacultyTag] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async () => {
        await onSubmit({ icon, facultyTag, name })
        handleClose()
    }

    const handleClose = () => {
        setFacultyTag('')
        setName('')
        setIcon(null)
        onClose()
    }

    // Блокировка скролла при открытии модалки
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (typeof window === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 transition-opacity z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none scrollbar-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto pointer-events-auto scrollbar-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Добавить факультет
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col gap-4'>
                                        <div className="flex flex-col w-full">
                                            <p className="mb-2 text-sm text-gray-600">Иконка факультета</p>
                                            <DragNDrop
                                                image={icon}
                                                setImage={setIcon}
                                                proportion={false}
                                                height='200px'
                                            />
                                        </div>

                                        <div className='flex flex-col w-full'>
                                            <FloatingInput
                                                id="name"
                                                label="Название факультета"
                                                value={name}
                                                onChange={setName}
                                                className="relative mb-6 w-full"
                                                maxLength={100}
                                            />
                                            <FloatingInput
                                                id="tag"
                                                label="Тег факультета"
                                                value={facultyTag}
                                                onChange={setFacultyTag}
                                                className="relative mb-2 w-full"
                                                maxLength={100}
                                            />
                                            <p className="text-xs sm:text-sm text-gray-700">
                                                После создания ваша специальность получит адрес типа{' '}
                                                <strong>example.uniplatform.by/faculty/{facultyTag || "tag"}</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Создать
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}

// Mock данные
const mockFaculties = [
    { id: 1, name: 'Факультет информационных технологий', tag: 'fit', icon: '/static/images/avatar_3.png', specialtyIds: [1, 2] },
    { id: 2, name: 'Экономический факультет', tag: 'economics', icon: '/static/images/avatar_3.png', specialtyIds: [3] },
    { id: 3, name: 'Юридический факультет', tag: 'law', icon: '/static/images/avatar_3.png', specialtyIds: [] },
];

const mockSpecialties = [
    { id: 1, name: 'Программная инженерия', qualification: 'Инженер-программист' },
    { id: 2, name: 'Информационные системы', qualification: 'Специалист по ИС' },
    { id: 3, name: 'Экономика предприятия', qualification: 'Экономист' },
    { id: 4, name: 'Веб-дизайн и разработка', qualification: 'Веб-разработчик' },
    { id: 5, name: 'Кибербезопасность', qualification: 'Специалист по безопасности' },
];

function FacultyCard({ faculty, onClick, isDragging, onDragStart, onDragEnd }) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
            className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab hover:border-blue-300 group ${isDragging ? 'opacity-50 scale-95 rotate-2 shadow-xl border-blue-400' : ''
                }`}
        >
            <div className="flex items-center gap-3 mb-2">
                <img
                    src={faculty.icon}
                    alt={faculty.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm">
                        {faculty.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">/{faculty.tag}</p>
                </div>
            </div>
        </div>
    );
}

function SpecialtyCard({ specialty, isDragging, onDragStart, onDragEnd, showRemove, onRemove }) {
    return (
        <div
            draggable={!showRemove}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm transition-all duration-200 group relative ${isDragging ? 'opacity-50 scale-95 shadow-xl border-blue-400' : showRemove ? '' : 'cursor-grab hover:border-blue-300 hover:shadow-md'
                }`}
        >
            {showRemove && (
                <button
                    onClick={onRemove}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-md z-10"
                >
                    <X size={14} />
                </button>
            )}
            <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{specialty.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{specialty.qualification}</p>
                </div>
            </div>
        </div>
    );
}

function EditingArea({
    faculty,
    onSave,
    onCancel,
    onDelete,
    isDropZone,
    onDrop,
    onDragOver,
    onDragLeave,
    allSpecialties,
    onSpecialtyDrop,
    onSpecialtyDragOver,
    onSpecialtyDragLeave,
    isSpecialtyDropZone
}) {
    const [editedFaculty, setEditedFaculty] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [icon, setIcon] = useState(null);
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);

    useEffect(() => {
        if (faculty) {
            setEditedFaculty({ ...faculty });
            setIcon(faculty.icon ? { name: 'faculty-icon', url: faculty.icon } : null);
            const assigned = allSpecialties.filter(s => faculty.specialtyIds.includes(s.id));
            setSelectedSpecialties(assigned);
            setIsEditing(true);
        }
    }, [faculty, allSpecialties]);

    const handleSave = () => {
        if (editedFaculty) {
            const specialtyIds = selectedSpecialties.map(s => s.id);
            onSave({ ...editedFaculty, icon: icon?.url || null, specialtyIds });
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        onDelete(editedFaculty.id);
        setIsEditing(false);
        setEditedFaculty(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedFaculty(null);
        setSelectedSpecialties([]);
        onCancel();
    };

    const handleRemoveSpecialty = (specialtyId) => {
        setSelectedSpecialties(prev => prev.filter(s => s.id !== specialtyId));
    };

    const handleSpecialtyDrop = (e) => {
        e.preventDefault();
        onSpecialtyDrop();
    };

    if (!editedFaculty) {
        return (
            <div
                className={`flex-1 flex sm:pt-20 items-start justify-center transition-all duration-300 h-full ${isDropZone ? 'border-blue-400 bg-blue-50 shadow-lg scale-100' : 'border-gray-300 bg-gray-50'
                    }`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                <div className="text-center text-gray-600 max-w-md p-4 md:p-8 flex flex-col justify-between gap-4">
                    <motion.div animate={{ scale: isDropZone ? 1.05 : 1 }} transition={{ duration: 0.3 }}>
                        <GraduationCap
                            className={`mx-auto h-12 w-12 md:h-16 md:w-16 mb-4 transition-colors duration-300 ${isDropZone ? 'text-blue-500' : 'text-gray-400'
                                }`}
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isDropZone ? 'drop' : 'drag'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-20 md:h-28 flex flex-col justify-center"
                        >
                            {isDropZone ? (
                                <>
                                    <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-blue-700">
                                        Отпустите для редактирования
                                    </h2>
                                    <p className="text-sm md:text-lg text-blue-600">
                                        Факультет готов к редактированию!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-gray-700">
                                        Перетащите факультет сюда
                                    </h2>
                                    <p className="text-sm md:text-lg text-gray-500">
                                        Перетащите карточку факультета из списка для редактирования
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex p-2 md:p-6 overflow-auto">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <Edit3 className="text-blue-600" />
                    <h2 className="text-base md:text-xl font-bold text-gray-900">Редактирование факультета</h2>
                </div>

                <div className="mt-4 md:mt-6 flex flex-col gap-3 md:gap-4 w-full items-center justify-between">
                    <div className="w-full md:w-[90%]">
                        <p className="mb-2 text-sm text-gray-600">Иконка факультета</p>
                        <DragNDrop image={icon} setImage={setIcon} proportion={false} height="200px" />
                    </div>

                    <FloatingInput
                        id="name"
                        label="Название факультета"
                        value={editedFaculty.name}
                        onChange={(value) => setEditedFaculty({ ...editedFaculty, name: value })}
                        className="relative w-full md:w-[90%]"
                        maxLength={100}
                    />

                    <FloatingInput
                        id="tag"
                        label="Тег факультета"
                        value={editedFaculty.tag}
                        onChange={(value) => setEditedFaculty({ ...editedFaculty, tag: value })}
                        className="relative w-full md:w-[90%]"
                        maxLength={100}
                    />

                    <div className="w-full md:w-[90%]">
                        <p className="mb-2 text-sm text-gray-600 font-medium">Специальности факультета</p>
                        <div
                            onDrop={handleSpecialtyDrop}
                            onDragOver={onSpecialtyDragOver}
                            onDragLeave={onSpecialtyDragLeave}
                            className={`min-h-[120px] border-2 border-dashed rounded-lg p-3 transition-all duration-200 ${isSpecialtyDropZone
                                ? 'border-blue-400 bg-blue-50'
                                : selectedSpecialties.length > 0
                                    ? 'border-gray-300 bg-gray-50'
                                    : 'border-gray-300 bg-white'
                                }`}
                        >
                            <AnimatePresence mode="popLayout">
                                {selectedSpecialties.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-center h-full min-h-[100px]"
                                    >
                                        <div className="text-center text-gray-400">
                                            <Telescope className="mx-auto h-8 w-8 mb-2" />
                                            <p className="text-sm">
                                                {isSpecialtyDropZone ? 'Отпустите здесь' : 'Перетащите специальности сюда'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {selectedSpecialties.map((specialty) => (
                                            <motion.div
                                                key={specialty.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <SpecialtyCard
                                                    specialty={specialty}
                                                    showRemove={true}
                                                    onRemove={() => handleRemoveSpecialty(specialty.id)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-6 flex flex-col gap-3 md:gap-4 w-full justify-center items-center">
                    <button
                        onClick={handleSave}
                        className="flex-1 w-full md:w-[90%] bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
                    >
                        <Save className="h-5 w-5" />
                        Сохранить
                    </button>

                    <div className="w-full md:w-[90%] flex flex-col md:flex-row gap-3">
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 md:py-3 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-medium flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
                        >
                            <Trash2 className="h-5 w-5" />
                            Удалить
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 md:py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FacultyManagementPage() {
    const [faculties, setFaculties] = useState(mockFaculties);
    const [specialties] = useState(mockSpecialties);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [draggedFaculty, setDraggedFaculty] = useState(null);
    const [draggedSpecialty, setDraggedSpecialty] = useState(null);
    const [isDropZone, setIsDropZone] = useState(false);
    const [isSpecialtyDropZone, setIsSpecialtyDropZone] = useState(false);
    const [showSpecialties, setShowSpecialties] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFaculties, setFilteredFaculties] = useState(mockFaculties);
    const [filteredSpecialties, setFilteredSpecialties] = useState([]);

    const handleFacultyClick = (faculty) => {
        if (!draggedFaculty) {
            setSelectedFaculty(faculty);
            setShowSpecialties(true);
        }
    };

    const handleFacultyDragStart = (faculty) => {
        setDraggedFaculty(faculty);
    };

    const handleFacultyDragEnd = () => {
        setDraggedFaculty(null);
        setIsDropZone(false);
    };

    const handleFacultyDrop = (e) => {
        e.preventDefault();
        if (draggedFaculty) {
            setSelectedFaculty(draggedFaculty);
            setShowSpecialties(true);
            setIsDropZone(false);
        }
    };

    const handleFacultyDragOver = (e) => {
        e.preventDefault();
        setIsDropZone(true);
    };

    const handleFacultyDragLeave = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDropZone(false);
        }
    };

    const handleSpecialtyDragStart = (specialty) => {
        setDraggedSpecialty(specialty);
    };

    const handleSpecialtyDragEnd = () => {
        setDraggedSpecialty(null);
        setIsSpecialtyDropZone(false);
    };

    const handleSpecialtyDrop = () => {
        if (draggedSpecialty && selectedFaculty) {
            const updatedFaculty = {
                ...selectedFaculty,
                specialtyIds: [...new Set([...selectedFaculty.specialtyIds, draggedSpecialty.id])]
            };
            setSelectedFaculty(updatedFaculty);
            setIsSpecialtyDropZone(false);
        }
    };

    const handleSpecialtyDragOver = (e) => {
        e.preventDefault();
        setIsSpecialtyDropZone(true);
    };

    const handleSpecialtyDragLeave = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsSpecialtyDropZone(false);
        }
    };

    const handleSave = (updatedFaculty) => {
        setFaculties((prev) =>
            prev.map((f) => (f.id === updatedFaculty.id ? updatedFaculty : f))
        );
        setSelectedFaculty(null);
        setShowSpecialties(false);
        console.log('Сохранён факультет:', updatedFaculty);
    };

    const handleCancel = () => {
        setSelectedFaculty(null);
        setShowSpecialties(false);
    };

    const handleDelete = (facultyId) => {
        setFaculties((prev) => prev.filter((f) => f.id !== facultyId));
        setSelectedFaculty(null);
        setShowSpecialties(false);
        console.log('Удалён факультет:', facultyId);
    };

    const availableSpecialties = specialties.filter(
        (s) => !selectedFaculty?.specialtyIds.includes(s.id)
    );

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredFaculties(faculties);
        } else {
            const filtered = faculties.filter(faculty =>
                faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faculty.tag.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFaculties(filtered);
        }
    }, [searchTerm, faculties]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSpecialties(availableSpecialties);
        } else {
            const filtered = availableSpecialties.filter(specialty =>
                specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                specialty.qualification.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSpecialties(filtered);
        }
    }, [searchTerm, selectedFaculty, specialties]);

    const handleSearch = () => {
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleCreate = async (data) => {
        console.log('Creating faculty:', data)
        // Здесь ваша логика создания факультета
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-shrink-0 bg-white pb-5 border-b border-gray-200">
                <div className="flex w-full justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Управление факультетами</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none transition-all active:scale-95 duration-200 shadow-md"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <FacultyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
            />

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 min-h-[400px] lg:min-h-auto border-b lg:border-b-0 lg:border-r border-gray-200">
                    <EditingArea
                        faculty={selectedFaculty}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={handleDelete}
                        isDropZone={isDropZone}
                        onDrop={handleFacultyDrop}
                        onDragOver={handleFacultyDragOver}
                        onDragLeave={handleFacultyDragLeave}
                        allSpecialties={specialties}
                        onSpecialtyDrop={handleSpecialtyDrop}
                        onSpecialtyDragOver={handleSpecialtyDragOver}
                        onSpecialtyDragLeave={handleSpecialtyDragLeave}
                        isSpecialtyDropZone={isSpecialtyDropZone}
                    />
                </div>

                <div className="w-full lg:w-80 xl:w-96 bg-white flex flex-col">
                    <AnimatePresence mode="wait">
                        {!showSpecialties ? (
                            <motion.div
                                key="faculties"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Факультеты</h2>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                className="block w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                                                placeholder="Поиск факультетов..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 duration-200 flex items-center justify-center"
                                            aria-label="Найти"
                                        >
                                            <Search className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-4 space-y-3">
                                        {filteredFaculties.map((faculty) => (
                                            <FacultyCard
                                                key={faculty.id}
                                                faculty={faculty}
                                                onClick={() => handleFacultyClick(faculty)}
                                                isDragging={draggedFaculty?.id === faculty.id}
                                                onDragStart={() => handleFacultyDragStart(faculty)}
                                                onDragEnd={handleFacultyDragEnd}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                                    <p className="text-xs md:text-sm text-gray-600 text-center">
                                        Найдено: <span className="font-medium">{filteredFaculties.length}</span> из <span className="font-medium">{faculties.length}</span> факультетов
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="specialties"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="flex-shrink-0 p-4 border-b border-gray-200">
                                    <button
                                        onClick={() => {
                                            setShowSpecialties(false);
                                            setSearchTerm('');
                                        }}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2 transition-colors"
                                    >
                                        <X size={16} />
                                        Назад к факультетам
                                    </button>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Специальности</h2>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                className="block w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
                                                placeholder="Поиск специальностей..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 duration-200 flex items-center justify-center"
                                            aria-label="Найти"
                                        >
                                            <Search className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-4 space-y-3">
                                        {filteredSpecialties.length === 0 ? (
                                            <div className="text-center text-gray-500 py-8">
                                                <Eye className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                                                <p className="text-sm">
                                                    {searchTerm.trim() !== '' ? 'Специальности не найдены' : 'Все специальности добавлены'}
                                                </p>
                                            </div>
                                        ) : (
                                            filteredSpecialties.map((specialty) => (
                                                <SpecialtyCard
                                                    key={specialty.id}
                                                    specialty={specialty}
                                                    isDragging={draggedSpecialty?.id === specialty.id}
                                                    onDragStart={() => handleSpecialtyDragStart(specialty)}
                                                    onDragEnd={handleSpecialtyDragEnd}
                                                    showRemove={false}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                                    <p className="text-xs md:text-sm text-gray-600 text-center">
                                        Найдено: <span className="font-medium">{filteredSpecialties.length}</span> из <span className="font-medium">{availableSpecialties.length}</span> специальностей
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}