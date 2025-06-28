import { useState, useEffect } from "react";
import { Clipboard, Check, ShieldAlert } from "lucide-react";
import { useUniversityForm } from "../(context)/UniversityFormContext";
import FloatingInput from "./FloatingInput";

export default function UniversityFinalForm() {
  const [universityTag, setUniversityTag] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { fullName } = useUniversityForm();
  const { xPer, setXPer } = useUniversityForm();

  useEffect(() => {
    generatePassword();
  }, []);

  const generateTag = () => {
    if (!fullName) return;

    // Создаём аббревиатуру из первых букв каждого слова
    const abbreviation = fullName
      .split(/\s+/) // Разбиваем по пробелам
      .map(word => word[0]) // Берем первую букву каждого слова
      .join('') // Объединяем в строку
      .toLowerCase(); // Переводим в нижний регистр

    // Транслитерация кириллицы
    const translitMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    // Переводим аббревиатуру в транслит
    let tag = '';
    for (const char of abbreviation) {
      tag += translitMap[char] || char; // Используем транслит или оставляем как есть (для латиницы)
    }

    // Очищаем от лишних символов
    tag = tag.replace(/[^a-z0-9]/g, '');

    setUniversityTag(tag);
  };


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
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-900 mb-10">Последний шаг</h1>
        <div className="flex gap-2">
          
          <FloatingInput
            tabIndex={xPer !== 5 ? -1 : 0}
            id={`tag`}
            label={'Уникальный идентификатор вашего вуза'}
            type={'text'}
            value={universityTag}
            onChange={e => setUniversityTag(e)}
            className="relative w-full max-w-2xl mx-auto"
          />
          <button
            onClick={generateTag}
            className="bg-blue-600 text-white px-6 h-[53.6px] rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block"
          >
            Сгенерировать
          </button>
        </div>
        <p className="mt-2 text-s text-gray-500 mb-4">
          Будет использоваться в URL: <span className="font-mono text-blue-600">
            {universityTag ? `${universityTag}.uniplatform.by` : "example.uniplatform.by"}
          </span>
        </p>
        <div className="mb-6">
          <div className="flex gap-2 items-center">
            <FloatingInput
              tabIndex={xPer !== 5 ? -1 : 0}
              id={`fullName`}
              label={'Пароль от ВУЗа'}
              type={'text'}
              value={generatedPassword}
              onChange={e => setGeneratedPassword(e)}
              className="relative w-full max-w-2xl mx-auto font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Скопировать"
            >
              {isCopied ? <Check className="text-green-500" /> : <Clipboard />}
            </button>
            <button
              onClick={generatePassword}
              className="bg-blue-600 text-white px-6 h-[53.6px] rounded-lg hover:bg-blue-700 cursor-pointer active:scale-[0.99] transition text-center block"
            >
              Новый
            </button>

          </div>
          <div className="flex items-center mt-4 gap-2">
            <ShieldAlert color="#fb2c36" className="  " />
            <p className=" text-s text-red-500">
              Сохраните этот пароль! Он не будет отображаться повторно.
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">Как это будет работать?</h3>
          <p className="text-sm text-blue-700">
            После создания ваш ВУЗ получит уникальный адрес типа <strong>{universityTag || "example"}.uniplatform.by</strong>.
            Используйте выданный пароль для входа в административную панель.
          </p>
        </div>
      </div>
    </div>
  )
} 