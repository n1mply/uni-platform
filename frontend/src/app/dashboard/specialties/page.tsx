'use client';

import { useState, useEffect } from 'react';
import { Search, Telescope, BookOpen, Calendar, Building2, GraduationCap, Eye } from 'lucide-react';
import { useAlertContext } from '@/app/(context)/AlertContext';

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


// Компонент карточки специальности
function SpecialtyCard({ specialty, onClick }: { specialty: Specialty; onClick: () => void }) {
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
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 pr-2">
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

export default function SpecialtyManagementPage() {
  const {showAlert} = useAlertContext()
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

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
    setSelectedSpecialty(specialty);
  };

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
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 bg-white pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Все специальности</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          {selectedSpecialty ? (
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedSpecialty.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-4">
                    {selectedSpecialty.qualification}
                  </p>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {(() => {
                    switch (selectedSpecialty.type_of_education) {
                      case 'Дневной':
                        return <Calendar className="h-6 w-6 text-blue-600" />;
                      case 'Заочный':
                        return <BookOpen className="h-6 w-6 text-green-600" />;
                      case 'Вечерний':
                        return <Building2 className="h-6 w-6 text-purple-600" />;
                      default:
                        return <GraduationCap className="h-6 w-6 text-gray-600" />;
                    }
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Форма обучения</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedSpecialty.type_of_education === 'Дневной' ? 'bg-blue-100 text-blue-800' :
                    selectedSpecialty.type_of_education === 'Заочный' ? 'bg-green-100 text-green-800' :
                    selectedSpecialty.type_of_education === 'Вечерний' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSpecialty.type_of_education}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Длительность</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedSpecialty.duration} {
                      selectedSpecialty.duration === 1 ? 'год' :
                      selectedSpecialty.duration >= 2 && selectedSpecialty.duration <= 4 ? 'года' :
                      'лет'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Редактировать
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Просмотр
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 max-w-md">
              <Telescope className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Выберите специальность
              </h2>
              <p className="text-lg text-gray-500">
                Выберите специальность из списка справа для её просмотра и редактирования.
                Вы также можете воспользоваться поиском по названию.
              </p>
            </div>
          )}
        </div>

        <div className="w-80 bg-white border-gray-200 flex flex-col">
          <div className="flex-shrink-0 pl-4 pb-2 pt-1 border-gray-100">
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
                className="px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 duration-200 flex items-center justify-center"
                aria-label="Найти"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {filteredSpecialties.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="font-medium">Специальности не найдены</p>
                  <p className="text-sm mt-2">Попробуйте изменить поисковый запрос</p>
                </div>
              ) : (
                filteredSpecialties.map((specialty) => (
                  <SpecialtyCard
                    key={specialty.id}
                    specialty={specialty}
                    onClick={() => handleSpecialtyClick(specialty)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex-shrink-0 p-4 border-t border-white bg-white">
            <p className="text-sm text-gray-600 text-center">
              Найдено: {filteredSpecialties.length} из {specialties.length} специальностей
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}