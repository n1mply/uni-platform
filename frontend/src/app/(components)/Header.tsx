'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Gauge } from "lucide-react";

type info = {
  id: number;
  tag: string;
  fullName: string;
  shortName: string;
  address: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [baseInfo, setBaseInfo] = useState<info | null>(null);
  const [hasCred, setHasCred] = useState(false)

  useEffect(() => {
    const getMe = async () => {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setHasCred(true)
        setBaseInfo(data)
        console.log(data)
      }
      else {
        setHasCred(false)
      }
    }
    getMe()
  }, [])

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-md fixed top-0 left-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="UniPlatform logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-lg hidden sm:flex  font-bold text-gray-800">UniPlatform</span>
      </Link>

      {!isOpen && (
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link href="/university" className="hover:text-blue-600 transition">ВУЗы</Link>
          <Link href="/migration" className="hover:text-blue-600 transition">Миграция к нам</Link>
          <Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link>
          {!hasCred ? (<Link href="/signin" className="ml-4 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700 transition">
            Войти
          </Link>)
            :
            (<Link href="/dashboard" className="ml-4 px-4 py-2 bg-blue-600 flex items-center gap-2 text-white cursor-pointer rounded hover:bg-blue-700 transition">
              В панель
              <Gauge />
            </Link>)
          }
        </nav>
      )}


      <button
        className="md:hidden text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col gap-4 md:hidden text-sm font-medium">
          <Link href="/university" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">ВУЗы</Link>
          <Link href="/migration" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">Миграция к нам</Link>
          <Link href="/faq" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition">FAQ</Link>
          {!hasCred ? (<Link href="/signin" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center">
            Войти
          </Link>)
            :
            (<Link href="/dashboard" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center">
              Перейти в панель
            </Link>)
          }
        </div>
      )}
    </header>
  );
}
