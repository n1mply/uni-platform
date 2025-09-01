'use client'
import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Image, Trash2, Plus } from 'lucide-react'
import FloatingInput from '@/app/(components)/FloatingInput'
import { Department, Faculty } from '../../departments/page'
import SmartSelect from '@/app/(components)/SmartSelect'
import { useAlertContext } from "@/app/(context)/AlertContext";

interface Section {
    id: string
    title: string
    content: string
}

// type TypeOfEducation = {
//     type: "Дневной" | "Заочный" | "Вечерний";
// };

export default function SpecialtiesPage() {
    const { showAlert } = useAlertContext();

    const [isCreating, setIsCreating] = useState(false)
    const [sections, setSections] = useState<Section[]>([])
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

    const [name, setName] = useState('')
    const [qualification, setQualification] = useState('')
    const [duration, setDuration] = useState('')
    const [faculty, setFaculty] = useState('')
    const [department, setDepartment] = useState('')
    const [typeOfEducation, setTypeOfEducation] = useState('')
    const [isActive, setIsActive] = useState(false)

    const [allFaculties, setAllFaculties] = useState<Faculty[]>()
    const [allDepartments, setAllDepartments] = useState<Department[]>()




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
                    console.log(data.data)
                }
            } catch {
                showAlert(["Ошибка при получении кафедры"]);
            }
        }
        getDepartments()
    }, [showAlert])

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
                    console.log(data.data)
                }
            } catch {
                showAlert(["Ошибка при получении факультетов"]);
            }
        }
        getFaculties()
    }, [showAlert])


    // Функция валидации формы
    const validateForm = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Валидация названия
        if (!name.trim()) {
            errors.push('Название обязательно для заполнения');
        } else if (name.length > 100) {
            errors.push('Название не должно превышать 100 символов');
        }

        // Валидация квалификации
        if (!qualification.trim()) {
            errors.push('Квалификация обязательна для заполнения');
        } else if (qualification.length > 100) {
            errors.push('Квалификация не должна превышать 100 символов');
        }

        // Валидация срока обучения
        if (!duration.trim()) {
            errors.push('Срок обучения обязателен для заполнения');
        } else if (duration.length > 100) {
            errors.push('Срок обучения не должен превышать 100 символов');
        }

        // Валидация вида получения образования
        if (!typeOfEducation) {
            errors.push('Вид получения образования обязателен для выбора');
        }

        if (faculty && !allFaculties?.some(f => f?.name === faculty)) {
            errors.push('Пожалуйста, выберите факультет из списка');
        }

        if (department && !allDepartments?.some(d => d?.name === department)) {
            errors.push('Пожалуйста, выберите кафедру из списка');
        }

        // Валидация секций
        if (sections.length < 2) {
            errors.push('Добавьте минимум 2 секции');
        } else if (sections.length > 10) {
            errors.push('Максимальное количество секций - 10');
        } else {
            // Проверка каждой секции
            sections.forEach((section, index) => {
                if (!section.title.trim()) {
                    errors.push(`Секция ${index + 1}: название обязательно`);
                } else if (section.title.length > 100) {
                    errors.push(`Секция ${index + 1}: название не должно превышать 100 символов`);
                }

                if (!section.content.trim()) {
                    errors.push(`Секция ${index + 1}: содержание обязательно`);
                } else if (section.content.length > 500000) {
                    errors.push(`Секция ${index + 1}: содержание не должно превышать 150000 элементов(возможно вы добавили слишком много изображений)`);
                    console.log(section.content.length)
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Проверка валидности формы в реальном времени
    useEffect(() => {
        const validation = validateForm();
        setIsActive(validation.isValid);
    }, [name, qualification, duration, typeOfEducation, faculty, department, sections]);

    const saveSpecialty = async () => {
        const validation = validateForm();

        if (!validation.isValid) {
            // Показываем ошибки пользователю
            showAlert(validation.errors);
            return { success: false, errors: validation.errors };
        }

        try {
            const f_id = faculty ? allFaculties?.find((f) => f?.name === faculty)?.id : null
            const d_id = department ? allDepartments?.find((d) => d?.name === department)?.id : null


            const payload = {
                name,
                qualification,
                duration: Number(duration),
                type_of_education: typeOfEducation,
                faculty_id: f_id,
                department_id: d_id,
                description_data: sections.map(section => ({
                    title: section.title,
                    content: section.content
                })),
            };

            console.log('Данные специальности:', payload);

            const response = await fetch('/api/specialty/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showAlert(['Специальность добавлена!'], false);
                await sleep(2000);
                location.reload();
            } else {
                const errorData = await response.json().catch(() => ({}));
                showAlert([errorData.message || 'Не удалось добавить специальность']);
            }

        } catch (error) {
            showAlert(['Не удалось добавить специальность']);
            return { success: false, error };
        }
    }

    // Добавляем стили для редакторов при монтировании компонента
    useEffect(() => {
        // Создаем стили для редактора
        const style = document.createElement('style')
        style.textContent = `
      .editor-content ul {
        list-style-type: disc !important;
        margin-left: 1.5rem !important;
        margin-top: 0.5rem !important;
        margin-bottom: 0.5rem !important;
        padding-left: 0 !important;
      }
      
      .editor-content ol {
        list-style-type: decimal !important;
        margin-left: 1.5rem !important;
        margin-top: 0.5rem !important;
        margin-bottom: 0.5rem !important;
        padding-left: 0 !important;
      }
      
      .editor-content li {
        margin-bottom: 0.25rem !important;
        display: list-item !important;
      }
      
      .editor-content strong {
        font-weight: bold !important;
      }
      
      .editor-content em {
        font-style: italic !important;
      }
      
      .editor-content img {
        max-width: 100% !important;
        height: auto !important;
        margin: 8px 0 !important;
      }
      
      .editor-content p {
        margin: 0.5rem 0 !important;
      }
      
      .editor-content div {
        margin: 0.25rem 0 !important;
      }
    `
        document.head.appendChild(style)

        // Очистка при размонтировании
        return () => {
            document.head.removeChild(style)
        }
    }, [])

    // Остальной код компонента остается без изменений...
    const createNewSection = () => {
        const newSection: Section = {
            id: Date.now().toString(),
            title: '',
            content: ''
        }
        setSections([...sections, newSection])
    }

    const updateSectionTitle = (id: string, title: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, title } : section
        ))
    }

    const updateSectionContent = (id: string, content: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, content } : section
        ))
    }

    const removeSection = (id: string) => {
        setSections(sections.filter(section => section.id !== id))
    }

    const formatText = (sectionId: string, command: string) => {
        const editor = document.getElementById(`editor-${sectionId}`)
        if (editor) {
            editor.focus()
            document.execCommand(command, false)
            updateSectionContent(sectionId, editor.innerHTML)
        }
    }

    const handleImageUpload = (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const editor = document.getElementById(`editor-${sectionId}`)
                if (editor && e.target?.result) {
                    const img = document.createElement('img')
                    img.src = e.target.result as string
                    img.style.maxWidth = '100%'
                    img.style.height = 'auto'
                    img.style.margin = '8px 0'
                    editor.appendChild(img)
                    updateSectionContent(sectionId, editor.innerHTML)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const resetEditor = () => {
        setIsCreating(false)
        setSections([])
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Добавить специальность</h1>
            <div className='flex justify-between gap-2 flex-wrap sm:w-full'>
                <div className='w-full'>
                    <div className='flex gap-2 flex-wrap sm:flex-nowrap'>
                        <FloatingInput
                            id="name"
                            label="Название"
                            value={name}
                            onChange={setName}
                            className="relative mb-4 w-full sm:w-1/2"
                            maxLength={100}
                        />
                        <FloatingInput
                            id="duration"
                            label="Срок обучения"
                            value={duration}
                            onChange={setDuration}
                            className="relative mb-6 w-full sm:w-1/2"
                            maxLength={100}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap sm:flex-nowrap'>
                        <FloatingInput
                            id="qualification"
                            label="Квалификация"
                            value={qualification}
                            onChange={setQualification}
                            className="relative mb-6 w-full sm:w-1/2"
                            maxLength={100}
                        />
                        <SmartSelect
                            id='typeOfEducation'
                            options={['Дневной', 'Вечерний', 'Заочный']}
                            value={typeOfEducation}
                            onChange={(option) => setTypeOfEducation(option)}
                            label='Вид получения'
                            className='mb-6 relative w-full sm:w-1/2'
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap sm:flex-nowrap'>
                        <SmartSelect
                            id='department'
                            options={allDepartments?.length > 0 ? allDepartments?.map((d) => (d?.name)) : []}
                            value={department}
                            onChange={(option) => setDepartment(option)}
                            label='Выпускающая кафедра'
                            className='mb-6 relative w-full sm:w-1/2'
                        />
                        <SmartSelect
                            id='faculty'
                            options={allFaculties?.length > 0 ? allFaculties?.map((f) => (f?.name)) : []}
                            value={faculty}
                            onChange={(option) => setFaculty(option)}
                            label='Привязанный факультет'
                            className='mb-6 relative w-full sm:w-1/2'
                        />
                    </div>
                    <p className='text-sm text-gray-500 mb-5 mt-[-10]'>Чтобы создать специальность нужно добавить описание, которое может состоять из множества секций (2 секции минимум, максимум 10).</p>
                </div>
            </div>

            <div className='flex w-full justify-between gap-2'>
                {!isCreating ? (
                    <div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium active:scale-[0.97] transition-all duration-300"
                        >
                            Создать описание
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 w-full">

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={createNewSection}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition-all duration-300 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Добавить секцию
                            </button>

                            {sections.length > 0 && (
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:flex-wrap">
                                    <button
                                        onClick={saveSpecialty}
                                        className={`flex-1 sm:flex-none  ${isActive ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.97]' : 'bg-gray-500 cursor-not-allowed'} transition-all duration-300 text-white px-4 py-2 rounded-lg font-medium`}
                                    >
                                        Добавить специальность
                                    </button>
                                    <button
                                        onClick={resetEditor}
                                        className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            )}
                        </div>

                        {sections.map((section) => (
                            <div key={section.id} className="rounded-lg p-2 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <input
                                        type="text"
                                        placeholder="Название секции (например: Места распределения выпускников)"
                                        value={section.title}
                                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                        className="flex-1 text-lg font-semibold text-gray-800 border-b border-gray-300 focus:border-blue-600 outline-none py-2 px-1"
                                        maxLength={200}
                                    />
                                    <button
                                        onClick={() => removeSection(section.id)}
                                        className="text-red-500 hover:text-red-700 p-1 ml-4"
                                        title="Удалить секцию"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {/* Панель инструментов */}
                                <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded border border-gray-300">
                                    <button
                                        onClick={() => formatText(section.id, 'bold')}
                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                        title="Жирный текст"
                                    >
                                        <Bold size={16} />
                                    </button>
                                    <button
                                        onClick={() => formatText(section.id, 'italic')}
                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                        title="Курсив"
                                    >
                                        <Italic size={16} />
                                    </button>
                                    <button
                                        onClick={() => formatText(section.id, 'insertUnorderedList')}
                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                        title="Маркированный список"
                                    >
                                        <List size={16} />
                                    </button>
                                    <button
                                        onClick={() => formatText(section.id, 'insertOrderedList')}
                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                        title="Нумерованный список"
                                    >
                                        <ListOrdered size={16} />
                                    </button>
                                    <button
                                        onClick={() => fileInputRefs.current[section.id]?.click()}
                                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                                        title="Добавить изображение"
                                    >
                                        <Image size={16} />
                                    </button>
                                    <input
                                        ref={(el) => {
                                            fileInputRefs.current[section.id] = el
                                        }}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(section.id, e)}
                                        className="hidden"
                                    />
                                </div>

                                {/* Редактор контента */}
                                <div
                                    id={`editor-${section.id}`}
                                    contentEditable
                                    onInput={(e) => updateSectionContent(section.id, e.currentTarget.innerHTML)}
                                    className="editor-content min-h-[200px] p-4 border border-gray-300 rounded-lg focus:border-blue-600 outline-none"
                                    suppressContentEditableWarning={true}
                                />

                                <div className="text-sm text-gray-500 mt-2">
                                    Используйте панель инструментов для форматирования текста. Можете создавать списки, выделять текст и добавлять изображения.
                                </div>
                            </div>
                        ))}

                        {sections.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg mb-2">Пока нет секций</p>
                                <p>Нажмите &quot;Добавить секцию&quot; чтобы создать первый блок контента</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}