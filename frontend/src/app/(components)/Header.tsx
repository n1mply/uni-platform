'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
        <span className="text-lg font-bold text-gray-800">UniPlatform</span>
      </Link>

      {!isOpen && (
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm font-medium">
            <Link href="/university" className="hover:text-blue-600 transition">ВУЗы</Link>
            <Link href="/migration" className="hover:text-blue-600 transition">Миграция к нам</Link>
            <Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link>
            <Link href="/login" className="ml-4 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700 transition">
                Войти
            </Link>
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
            <Link href="/login" onClick={() => setIsOpen(false)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center">
                Войти
            </Link>
        </div>
      )}
    </header>
  );
}
