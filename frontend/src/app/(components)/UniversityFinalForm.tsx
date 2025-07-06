"use client"

import { useState, useEffect } from "react";
import { Clipboard, Check, ShieldAlert, Hash, RefreshCw } from "lucide-react";
import { useUniversityForm } from "../(context)/UniversityFormContext";
import generateTag from "../(hooks)/generateTag";
import DragNDrop from "./DragNDrop";

export default function UniversityFinalForm() {
  const { fullName } = useUniversityForm();
  const { xPer, setXPer } = useUniversityForm();
  const { image, setImage } = useUniversityForm()
  const { universityImage, setUniversityImage } = useUniversityForm()
  const { universityTag, setUniversityTag } = useUniversityForm();
  const { generatedPassword, setGeneratedPassword } = useUniversityForm();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const checkForUniImage = async() =>{
      if (image){
        setUniversityImage(image)
      }
      else{
        setUniversityImage(null)
      }
    };
    checkForUniImage()
  }, [image]);


  useEffect(() => {
    generatePassword();
  }, []);

  const validateAllSteps = () => {
    if (universityTag) {
      setXPer(xPer + 1)
    }
    else {
      console.error('Поле с тэгом не может быть пустым!')
    }
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 20; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-screen flex flex-col px-4 items-center">
      <div className="w-full lg:max-w-2xl flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-gray-900 mb-4">Последний шаг</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center">Настройте уникальные параметры для вашего ВУЗа</p>

        <div className="flex flex-col gap-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-5">
            <DragNDrop tabIndex={xPer !== 5 ? -1 : 0} />
            <p className="text-sm lg:text-base text-gray-600 text-left lg:w-2/3">
              Добавьте логотип университета<br />(рекомедуется формат svg, 512x512px)
            </p>
          </div>
        </div>


        {/* University ID Section */}
        <div className="flex flex-col gap-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-blue-600">
            <Hash className="bg-blue-50 rounded-lg h-7 w-7" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Идентификатор ВУЗа</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <input
              type="text"
              id="tag"
              placeholder="bsuir, gtsu, bsu и др."
              value={universityTag}
              onChange={(e) => setUniversityTag(e.target.value)}
              tabIndex={xPer !== 5 ? -1 : 0}
              className="w-full border rounded px-3 py-2 border-gray-300 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />

            <button
              onClick={() => generateTag(fullName, setUniversityTag)}
              tabIndex={xPer !== 5 ? -1 : 0}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block sm:w-auto"
            >
              Сгенерировать
            </button>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            Будет использоваться в URL: <span className="font-mono text-blue-600">
              {universityTag ? `${universityTag}.uniplatform.by` : "example.uniplatform.by"}
            </span>
          </p>
        </div>

        {/* Admin Password Section */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600">
            <ShieldAlert className="bg-blue-50 rounded-lg h-7 w-7" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Пароль администратора</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-grow">
              <input
                type="text"
                id="tag"
                placeholder=""
                value={generatedPassword}
                disabled
                tabIndex={xPer !== 5 ? -1 : 0}
                onChange={(e) => setGeneratedPassword(e.target.value)}
                className="font-mono h-full w-full border rounded px-3 py-2 border-gray-300 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex gap-2 justify-end sm:justify-start">
              <button
                onClick={copyToClipboard}
                className="p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Скопировать"
                tabIndex={xPer !== 5 ? -1 : 0}
              >
                {isCopied ? (
                  <Check className="text-green-500" size={18} />
                ) : (
                  <Clipboard size={18} className="text-gray-500" />
                )}
              </button>
              <button
                onClick={generatePassword}
                tabIndex={xPer !== 5 ? -1 : 0}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition-all"
                title="Сгенерировать новый"
              >
                <RefreshCw size={16} />
                <span className="sr-only sm:not-sr-only">Обновить</span>
              </button>
            </div>
          </div>

          <div className="flex items-center mt-3 sm:mt-4 gap-2">
            <p className="text-xs sm:text-sm text-gray-700">
              Обязательно сохраните этот пароль! Он будет показан только один раз и не может быть восстановлен.
            </p>
          </div>
        </div>

        <h1 className="font-medium text-gray-800 mb-2">Как это будет работать?</h1>
        <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">
          После создания ваш ВУЗ получит уникальный адрес типа <strong>{universityTag || "example"}.uniplatform.by</strong>.
          Используйте выданный пароль для входа в административную панель.
        </p>

        <button
          tabIndex={xPer !== 5 ? -1 : 0}
          onClick={() => validateAllSteps()}
          className="w-full mx-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center"
        >
          Создать ВУЗ
        </button>
      </div>
    </div>
  )
}