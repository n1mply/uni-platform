'use client'
import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Image, Trash2, Plus } from 'lucide-react'

interface Section {
    id: string
    title: string
    content: string
}

export default function SpecialtiesPage() {
    const [isCreating, setIsCreating] = useState(false)
    const [sections, setSections] = useState<Section[]>([])
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

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

    const saveDescription = () => {
        const description = {
            sections: sections.map(section => ({
                title: section.title,
                content: section.content
            })),
            createdAt: new Date().toISOString()
        }
        console.log('Описание специальности:', description)
    }

    const resetEditor = () => {
        setIsCreating(false)
        setSections([])
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Специальности</h1>

            {!isCreating ? (
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium active:scale-[0.97] transition-all duration-300"
                >
                    Создать описание
                </button>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={createNewSection}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition-all duration-300 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Добавить секцию
                        </button>

                        {sections.length > 0 && (
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button
                                    onClick={saveDescription}
                                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition-all duration-300 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Сохранить описание
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
                            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded border border-gray-3  00">
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
                                placeholder="Введите содержимое секции..."
                            />

                            <style jsx>{`
                #editor-${section.id} ul {
                  list-style-type: disc;
                  margin-left: 1.5rem;
                  margin-top: 0.5rem;
                  margin-bottom: 0.5rem;
                }
                
                #editor-${section.id} ol {
                  list-style-type: decimal;
                  margin-left: 1.5rem;
                  margin-top: 0.5rem;
                  margin-bottom: 0.5rem;
                }
                
                #editor-${section.id} li {
                  margin-bottom: 0.25rem;
                }
                
                #editor-${section.id} strong {
                  font-weight: bold;
                }
                
                #editor-${section.id} em {
                  font-style: italic;
                }
                
                #editor-${section.id} img {
                  max-width: 100%;
                  height: auto;
                  margin: 8px 0;
                }
                
                #editor-${section.id} p {
                  margin: 0.5rem 0;
                }
              `}</style>

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
                </div >
            )
            }
        </>
    )
}