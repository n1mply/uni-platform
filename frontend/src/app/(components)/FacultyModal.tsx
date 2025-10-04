'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingInput from '@/app/(components)/FloatingInput'
import { ImageState } from '@/app/(context)/UniversityFormContext';
import DragNDrop from "@/app/(components)/DragNDrop";
import { Plus } from 'lucide-react';
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
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
                  <Plus size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className="flex flex-col w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-[300px]">
                      <p className="mb-2 text-sm text-gray-600">Иконка факультета</p>
                      <DragNDrop
                        image={icon}
                        setImage={setIcon}
                        proportion={false}
                        height='200px'
                      />
                    </div>

                    <div className='flex flex-col w-full sm:flex-1'>
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

// Основной компонент
export default function FaculiesCreatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreate = async (data) => {
    console.log('Creating faculty:', data)
    // Здесь ваша логика создания факультета
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Факультеты</h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none transition-all active:scale-95 duration-200 shadow-md"
        >
          <Plus size={20} />
        </button>
      </div>

      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />

      <p>Совершенно другой контент для тестов</p>
    </>
  )
}