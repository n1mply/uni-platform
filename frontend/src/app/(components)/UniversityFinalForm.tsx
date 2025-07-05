"use client"

import { useState, useEffect } from "react";
import { Clipboard, Check, ShieldAlert, Hash, RefreshCw } from "lucide-react";
import { useUniversityForm } from "../(context)/UniversityFormContext";
import generateTag from "../(hooks)/generateTag";

export default function UniversityFinalForm() {
  const { fullName } = useUniversityForm();
  const { xPer, setXPer } = useUniversityForm();
  const { universityTag, setUniversityTag } = useUniversityForm();
  const { generatedPassword, setGeneratedPassword } = useUniversityForm();
  const [isCopied, setIsCopied] = useState(false);


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
      <div className="w-[50%] flex flex-col">
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-900 mb-4">Последний шаг</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Настройте уникальные параметры для вашего ВУЗа</p>
        <div className="flex flex-col gap-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-2 rounded-lg  text-blue-600">
            <Hash className="bg-blue-50 rounded-lg h-7 w-7" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Идентификатор ВУЗа</h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              id="tag"
              placeholder="bsuir, gtsu, bsu и др."
              value={universityTag}
              onChange={(e) => setUniversityTag(e.target.value)}
              tabIndex={xPer !== 5 ? -1 : 0}
              className="relative w-full max-w-2xl mx-auto border rounded pl-3 border-gray-300 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
            />

            <button
              onClick={() => generateTag(fullName, setUniversityTag)}
              tabIndex={xPer !== 5 ? -1 : 0}
              className="bg-blue-600 text-white px-6 p-2.5 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block"
            >
              Сгенерировать
            </button>
          </div>

          <p className="mt-2 text-s text-gray-500">
            Будет использоваться в URL: <span className="font-mono text-blue-600">
              {universityTag ? `${universityTag}.uniplatform.by` : "example.uniplatform.by"}
            </span>
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 round ed-lg  text-blue-600">
            <ShieldAlert className="bg-blue-50 rounded-lg h-7 w-7" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Пароль администратора</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              id="tag"
              placeholder=""
              value={generatedPassword}
              disabled
              tabIndex={xPer !== 5 ? -1 : 0}
              onChange={(e) => setGeneratedPassword(e.target.value)}
              className="font-mono relative w-full max-w-2xl mx-auto border rounded pl-3 border-gray-300 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
            />
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition-all"
                title="Сгенерировать новый"
              >
                <RefreshCw size={16} />
              </button>
            </div>

          </div>
          <div className="flex items-center mt-4 gap-2">
            <p className="text-s w-[85%] text-gray-700">
              Обязательно сохраните этот пароль! Он будет показан только один раз и не может быть восстановлен.
            </p>
          </div>
        </div>
        <h1 className="font-medium text-gray-800 mb-2">Как это будет работать?</h1>
        <p className="text-s text-gray-700">
          После создания ваш ВУЗ получит уникальный адрес типа <strong>{universityTag || "example"}.uniplatform.by</strong>.
          Используйте выданный пароль для входа в административную панель.
        </p>
        <button
          tabIndex={xPer !== 5 ? -1 : 0}
          onClick={() => validateAllSteps()}
          className={`w-full mx-auto mt-6 mb-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block`}
        >
          Создать ВУЗ
        </button>
      </div>
    </div>
  )
} 