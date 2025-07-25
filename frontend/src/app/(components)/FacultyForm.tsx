'use client'
import { useState, useEffect } from "react"
import FloatingInput from "@/app/(components)/FloatingInput";
import { useUniversityForm } from "@/app/(context)/UniversityFormContext";
import { Faculty } from "@/app/(context)/UniversityFormContext";
import DragNDrop from "@/app/(components)/DragNDrop";
import { BriefcaseBusiness, X, BookDashed } from 'lucide-react'
import generateTag from "../(hooks)/generateTag";

export default function FacultyForm() {
  const { xPer, setXPer } = useUniversityForm();
  const { image, setImage } = useUniversityForm()
  const { faculties, setFaculties } = useUniversityForm()
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [unactive, setUnactive] = useState(true)
  const [nextStep, setNextStep] = useState(false)

  useEffect(() => {
    const validateForm = async () => {
      if (name && image) {
        setUnactive(false)
      }
      else {
        setUnactive(true)
      }
    }

    validateForm()
  }, [name, image])

  useEffect(()=>{
    const createTag = async() =>{
      generateTag(name, setTag)
    }
    createTag()
  }, [name])

  useEffect(() => {
    const validateFaculties = async () => {
      if (faculties.length >= 1) {
        setNextStep(true)
      }
      else {
        setNextStep(false)
      }
    }

    validateFaculties()
  }, [faculties])

  const handleContinue = () => {
    if (faculties.length >= 1) {
      setXPer(xPer + 1)
    }
  }

  const deleteFaculties = (index: number) => {
    setFaculties(prevFaculties =>
      prevFaculties.filter((_, i) => i !== index)
    );
  };

  const updateFaculties = () => {
    if (image && name.trim()) {
      const newFaculty: Faculty = {
        name: name,
        tag: tag,
        iconURL: image,
      };

      setFaculties((prevFaculties) => [...prevFaculties, newFaculty]);
      setName('');
      setTag('');
      setImage(null)
    } else {
      console.error("Image or faculty name is missing!");
    }
  };

  return (
    <div className="w-screen flex flex-col lg:flex-row lg:gap-[100px] pr-4 lg:pr-2 lg:pl-2">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 mx-2.5 mb-8 lg:mb-0">
        <h1 className="text-3xl absolute md:text-4xl lg:text-5xl text-left font-bold text-gray-900 lg:mb-6">Факультеты</h1>
        <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 text-left mt-10 lg:mt-15">
          Укажите основную информацию о факультетах: иконка и название.
          Вы можете создать несколько факультетов
        </p>
        
        <div className="flex flex-col lg:flex-row lg:items-start gap-5 mb-4">
          <DragNDrop tabIndex={xPer !== 2 ? -1 : 0}/>
          <p className="text-gray-600 text-left lg:w-2/3 mt-0">
            Добавьте иконку факультету<br />
            Перетащите её сюда или нажмите, чтобы выбрать. Доступен предпросмотр
          </p>
        </div>
        
        <FloatingInput
          tabIndex={xPer !== 2 ? -1 : 0}
          id={`name`}
          label={'Название факультета'}
          type={'text'}
          value={name}
          onChange={e => setName(e)}
        />
        <FloatingInput
          tabIndex={xPer !== 2 ? -1 : 0}
          id={`name`}
          label={'Индентификатор факультета'}
          type={'text'}
          value={tag}
          onChange={e => setTag(e)}
        />
        <p className="text-s lg:text-sm ml-2 mb-4 text-gray-600 text-left">
          Этот тэг будет использоваться в URL адресе для поиска и отображеиния вашего факультета
        </p>
        
        <button
          tabIndex={xPer !== 2 ? -1 : 0}
          onClick={() => updateFaculties()}
          disabled={unactive}
          className={`w-full lg:max-w-2xl mx-auto ${unactive ? 'bg-gray-500' : 'bg-blue-600 active:scale-[0.99]'} text-white px-6 py-3 rounded-lg ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${unactive ? 'cursor-not-allowed' : 'cursor-pointer'} transition text-center block`}
        >
          Добавить факультет
        </button>
        
        <button
          tabIndex={xPer !== 2 ? -1 : 0}
          onClick={() => handleContinue()}
          disabled={!nextStep}
          className={`w-full lg:max-w-2xl mb-2 mx-auto mt-4 lg:mt-5 ${!nextStep ? 'bg-gray-500' : 'bg-blue-600 active:scale-[0.99]'} text-white px-6 py-3 rounded-lg ${!nextStep ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} ${!nextStep ? 'cursor-not-allowed' : 'cursor-pointer'} transition text-center block`}
        >
          Продолжить
        </button>
        
        <p className="text-s lg:text-sm ml-2 text-gray-600 mb-4 lg:mb-8 text-left">
          Для продолжения создайте минимум один факультет, в будущем вы сможете добавить больше и создать кафедры со специальностями
        </p>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-1/2">
        <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 text-left mt-4 lg:mt-15 px-4">
          Предпросмотр. Здесь появятся созданные вами факультеты
          для препросмотра его карточки(тестовые данные)
        </p>
        
        <div className={`h-auto lg:h-[500px] ${faculties.length === 0 ? 'lg:overflow-y-auto' : 'lg:overflow-y-scroll'} mb-8 lg:mb-0`}>
          {faculties.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full py-8 lg:py-0">
              <BookDashed color="#4a5565" size={98} className="mx-auto" />
              <p className="text-base lg:text-lg text-gray-600 mb-8 text-center mt-3">Список факультетов пока пуст</p>
            </div>
          ) : (
            faculties.map((f, i) => (
              <div
                key={i}
                className="flex items-center bg-white relative rounded-lg shadow-sm border mb-4 border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 flex-shrink-0 mr-4">
                  <img src={f.iconURL?.url} alt={f.name} width={64} height={64} className="rounded" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{f.name}</h3>
                  <p className="text-blue-600 text-xs lg:text-sm">@{f.tag}</p>
                  <div className="flex gap-2 items-center">
                    <BriefcaseBusiness color="#6a7282" size={18} />
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">3 специальности</p>
                  </div>
                </div>
                <button tabIndex={xPer !== 2 ? -1 : 0} onClick={() => deleteFaculties(i)}>
                  <X />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}