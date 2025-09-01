'use client';

import { useState, useEffect } from 'react';
import { Search, Telescope, BookOpen, Calendar, Building2, GraduationCap, Eye, Edit3, Save, X, Trash2 } from 'lucide-react';
import FloatingInput from '@/app/(components)/FloatingInput';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlertContext } from '@/app/(context)/AlertContext';
import SmartSelect from '@/app/(components)/SmartSelect';
import { Department, Faculty } from '../departments/page'

interface DescriptionItem {
  title: string;
  content: string;
}

interface Specialty {
  id: number;
  name: string;
  qualification: string;
  duration: number;
  type_of_education: string;
  faculty_id: number | null;
  department_id: number | null;
  university_id: number;
  description_data: DescriptionItem[] | null;
}

function SpecialtyCard({
  specialty,
  onClick,
  isDragging,
  onDragStart,
  onDragEnd
}: {
  specialty: Specialty;
  onClick: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const getEducationTypeIcon = (type: string) => {
    switch (type) {
      case 'Дневной':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'Заочный':
        return <BookOpen className="h-4 w-4 text-green-600" />;
      case 'Вечерний':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      default:
        return <GraduationCap className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEducationTypeColor = (type: string) => {
    switch (type) {
      case 'Дневной':
        return 'bg-blue-100 text-blue-800';
      case 'Заочный':
        return 'bg-green-100 text-green-800';
      case 'Вечерний':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentYearText = (years: number) => {
    if (years === 1) return 'год';
    if (years >= 2 && years <= 4) return 'года';
    return 'лет';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab hover:border-blue-300 group ${isDragging ? 'opacity-50 scale-95 rotate-2 shadow-xl border-blue-400' : ''
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 pr-2 text-sm md:text-base">
          {specialty.name}
        </h3>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {getEducationTypeIcon(specialty.type_of_education)}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {specialty.qualification}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full font-medium ${getEducationTypeColor(specialty.type_of_education)}`}>
          {specialty.type_of_education}
        </span>
        <span className="text-gray-500 font-medium">{specialty.duration} {getCurrentYearText(specialty.duration)}</span>
      </div>
    </div>
  );
}

function EditingArea({
  specialty,
  onSave,
  onCancel,
  onDelete,
  isDropZone,
  onDrop,
  onDragOver,
  onDragLeave
}: {
  specialty: Specialty | null;
  onSave: (specialty: Specialty, faculty: string, department: string, allFaculties: Faculty[], allDepartments: Department[]) => void;
  onCancel: () => void;
  onDelete: (specailty_id: number) => void;
  isDropZone: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}) {
  const [editedSpecialty, setEditedSpecialty] = useState<Specialty | null>(specialty);
  const [isEditing, setIsEditing] = useState(false);
  const [allFaculties, setAllFaculties] = useState<Faculty[]>([])
  const [allDepartments, setAllDepartments] = useState<Department[]>([])
  const [faculty, setFaculty] = useState('')
  const [department, setDepartment] = useState('')
  const { showAlert } = useAlertContext()

  useEffect(() => {
    if (specialty) {
      setEditedSpecialty({ ...specialty });
      setIsEditing(true);
    }
  }, [specialty]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await fetch(`/api/department/get/all`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAllDepartments(data.data)
          const baseDepartment = editedSpecialty?.department_id ? data.data?.find((d: Department) => d?.id == editedSpecialty?.department_id)?.name : ''
          setDepartment(baseDepartment || '')
        }
      } catch {
        showAlert(["Ошибка при получении кафедры"]);
      }
    }
    getDepartments()
  }, [editedSpecialty?.department_id, showAlert])

  useEffect(() => {
    const getFaculties = async () => {
      try {
        const response = await fetch(`/api/faculty/get/all`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAllFaculties(data.data)
          const baseFaculty = editedSpecialty?.faculty_id ? data.data?.find((f: Faculty) => f?.id == editedSpecialty?.faculty_id)?.name : ''
          setFaculty(baseFaculty || '')
        }
      } catch {
        showAlert(["Ошибка при получении факультетов"]);
      }
    }
    getFaculties()
  }, [editedSpecialty?.faculty_id, showAlert])

  const handleSave = () => {
    if (editedSpecialty) {
      onSave(editedSpecialty, faculty, department, allFaculties, allDepartments);
      setIsEditing(false);
    }
  };


  const handleDelete = () => {
    onDelete(editedSpecialty.id)
    setIsEditing(false);
    setEditedSpecialty(null);
  }

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSpecialty(null);
    onCancel();
  };


  if (!editedSpecialty) {
    return (
      <div
        className={`flex-1 flex sm:pt-20 items-start justify-center transition-all duration-300 h-full ${isDropZone
          ? 'border-blue-400 bg-blue-50 shadow-lg scale-100'
          : 'border-gray-300 bg-gray-50'
          }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="text-center text-gray-600 max-w-md p-4 md:p-8 flex flex-col justify-between gap-4">
          <motion.div
            animate={{ scale: isDropZone ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Telescope className={`mx-auto h-12 w-12 md:h-16 md:w-16 mb-4 transition-colors duration-300 ${isDropZone ? 'text-blue-500' : 'text-gray-400'
              }`} />
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
                    Специальность готова к редактированию!
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-gray-700">
                    Перетащите специальность сюда
                  </h2>
                  <p className="text-sm md:text-lg text-gray-500">
                    Перетащите карточку специальности из списка для редактирования
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
    <div className='flex-1 flex p-2 md:p-6 overflow-auto'>
      <div className='max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 mx-auto'>
        <div className="flex items-center gap-3 mb-4">
          <Edit3 className=" text-blue-600" />
          <h2 className="text-base md:text-xl font-bold text-gray-900">Редактирование специальности</h2>
        </div>
        <div className='mt-4 md:mt-6 flex flex-col gap-3 md:gap-4 w-full items-center justify-between'>
          <FloatingInput
            id='name'
            label='Название'
            type='text'
            value={editedSpecialty.name}
            onChange={(value) => setEditedSpecialty({ ...editedSpecialty, name: value })}
            className='relative w-full md:w-[90%]'
          />
          <FloatingInput
            id='qualification'
            label='Квалификация'
            type='text'
            value={editedSpecialty.qualification}
            onChange={(value) => setEditedSpecialty({ ...editedSpecialty, qualification: value })}
            className='relative w-full md:w-[90%]'
          />
          <div className='w-full md:w-[90%] flex flex-col md:flex-row gap-3'>
            <FloatingInput
              id='duration'
              label='Срок обучения'
              type='text'
              value={editedSpecialty.duration.toString()}
              onChange={(value) => setEditedSpecialty({ ...editedSpecialty, duration: parseInt(value) || 0 })}
              className='relative w-full md:w-1/2'
            />
            <SmartSelect
              id='typeOfEducation'
              options={['Дневной', 'Вечерний', 'Заочный']}
              value={editedSpecialty.type_of_education}
              onChange={(value) => setEditedSpecialty({ ...editedSpecialty, type_of_education: value })}
              label='Вид получения'
              className='relative w-full md:w-1/2'
            />
          </div>
          <div className='w-full md:w-[90%] flex flex-col md:flex-row gap-3'>
            <SmartSelect
              id='department'
              options={allDepartments?.length > 0 ? allDepartments?.map((d) => (d?.name)) : []}
              value={department}
              onChange={(option) => setDepartment(option)}
              label='Кафедра'
              className='relative w-full md:w-1/2'
            />
            <SmartSelect
              id='faculty'
              options={allFaculties?.length > 0 ? allFaculties?.map((f) => (f?.name)) : []}
              value={faculty}
              onChange={(option) => setFaculty(option)}
              label='Факультет'
              className='relative w-full md:w-1/2'
            />
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

          <div className='w-full md:w-[90%] flex flex-col md:flex-row gap-3'>
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

export default function SpecialtyManagementPage() {
  const { showAlert } = useAlertContext()

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [draggedSpecialty, setDraggedSpecialty] = useState<Specialty | null>(null);
  const [isDropZone, setIsDropZone] = useState(false);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/specialty/get/all');

      if (!response.ok) {
        showAlert(['Не удалось получить специальности'])
        throw new Error('Ошибка загрузки специальностей');
      }

      const data = await response.json();
      setSpecialties(data.data);
      setFilteredSpecialties(data.data);
    } catch {
      showAlert(['Не удалось получить специальности'])
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty =>
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialty.qualification.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchTerm, specialties]);

  const handleSpecialtyClick = (specialty: Specialty) => {
    if (!draggedSpecialty) {
      setSelectedSpecialty(specialty);
    }
  };

  const handleDragStart = (specialty: Specialty) => {
    setDraggedSpecialty(specialty);
  };

  const handleDragEnd = () => {
    setDraggedSpecialty(null);
    setIsDropZone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSpecialty) {
      setSelectedSpecialty(draggedSpecialty);
      setIsDropZone(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZone(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDropZone(false);
    }
  };

  const handleSave = async (updatedSpecialty: Specialty, faculty: string, department: string, allFaculties: Faculty[], allDepartments: Department[]) => {
    setSpecialties(prev =>
      prev.map(s => s.id === updatedSpecialty.id ? updatedSpecialty : s)
    );

    const f_id = faculty ? allFaculties?.find((f) => f?.name === faculty)?.id : null
    const d_id = department ? allDepartments?.find((d) => d?.name === department)?.id : null

    const payload = {
      name: updatedSpecialty.name,
      qualification: updatedSpecialty.qualification,
      duration: Number(updatedSpecialty.duration),
      type_of_education: updatedSpecialty.type_of_education,
      faculty_id: f_id,
      department_id: d_id,
      description_data: updatedSpecialty.description_data
    };

    const response = await fetch(`/api/specialty/update/base/${updatedSpecialty.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showAlert(['Специальность обновлена!'], false);
      location.reload();
    } else {
      const errorData = await response.json().catch(() => ({}));
      showAlert([errorData.message || 'Не удалось обновить специальность']);
    }


    setSelectedSpecialty(null);
    console.log('Сохранена специальность:', payload);
  };

  const handleCancel = () => {
    setSelectedSpecialty(null);
  };

  const handleDelete = async (specailty_id: number) => {
    try {
      const response = await fetch(`/api/specialty/delete/${specailty_id}`, {
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
    }
    catch {

    }
  }

  const handleSearch = () => {
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 bg-white pb-5 border-b border-gray-200">
        <div className="max-w-7xl w-full">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Все специальности</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 min-h-[400px] lg:min-h-auto border-b lg:border-b-0 lg:border-r border-gray-200">
          <EditingArea
            specialty={selectedSpecialty}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            isDropZone={isDropZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          />
        </div>

        <div className="w-full lg:w-80 xl:w-96 bg-white flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
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
                  <p className="font-medium text-sm md:text-base">Специальности не найдены</p>
                  <p className="text-xs md:text-sm mt-1">Попробуйте изменить поисковый запрос</p>
                </div>
              ) : (
                filteredSpecialties.map((specialty) => (
                  <SpecialtyCard
                    key={specialty.id}
                    specialty={specialty}
                    onClick={() => handleSpecialtyClick(specialty)}
                    isDragging={draggedSpecialty?.id === specialty.id}
                    onDragStart={() => handleDragStart(specialty)}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <p className="text-xs md:text-sm text-gray-600 text-center">
              Найдено: <span className="font-medium">{filteredSpecialties.length}</span> из <span className="font-medium">{specialties.length}</span> специальностей
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}