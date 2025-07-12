"use client"
import { useEffect, useState } from "react";
import FloatingInput from "../(components)/FloatingInput";
import ErrorAlert from "../(components)/ErrorAlert";
import { useRouter } from "next/navigation";


export default function SignIn() {
  const [tag, setTag] = useState('')
  const [password, setPassword] = useState('')
  const [unactive, setUnactive] = useState(true)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const router = useRouter();

  useEffect(() => {
    const validateForm = async () => {
      if (tag && password) {
        setUnactive(false)
      }
      else {
        setUnactive(true)
      }
    }
    validateForm()
  }, [tag, password])

  const handleSubmit = async () => {
    if (tag && password) {
      try {
        const signInData = {
          tag, password
        }
        const response = await fetch('/api/auth/signin/university', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signInData)
        });

        const data = await response.json()

        if (response.ok) {
          console.log('Успешный вход!')
          router.push("/dashboard")
          location.reload()
          setErrorMessages([])
        }
        else {
          setErrorMessages([data.detail.split(': ')[1]])
        }
      }
      catch (error) {
        console.error('Cannot sign you in to System:', error);
      }
    }
  }

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="flex flex-col max-w-[700px] items-center justify-center border border-blue-400 p-4 rounded-md gap-4">
        <ErrorAlert errors={errorMessages}/>
        <h1 className="text-4xl text-center md:text-5xl max-w-2xl w-full mx-auto font-bold text-gray-900">Добро пожаловать</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl w-full mx-auto text-center">
          Войдите в систему с помощью тега и пароля, которые вы должны были сохранить на этапе регистрации
        </p>
        <FloatingInput
          id="tag"
          label="Тег ВУЗа"
          value={tag}
          onChange={setTag}
          required
          className="relative w-full max-w-2xl mx-auto"
        />

        <FloatingInput
          id="pwd"
          label="Пароль"
          value={password}
          onChange={setPassword}
          type="password"
          required
          className="relative w-full max-w-2xl mx-auto mb-10"
        />

        <button
          onClick={() => handleSubmit()}
          className={`w-full max-w-2xl mb-2 mx-auto ${unactive ? 'bg-gray-500' : 'bg-blue-600'} text-white px-6 py-3 rounded-md ${unactive ? 'hover:bg-gray-500' : 'hover:bg-blue-700'} cursor-pointer  transition text-center block`}
        >
          Далее
        </button>
      </div>
    </div>
  );
}

