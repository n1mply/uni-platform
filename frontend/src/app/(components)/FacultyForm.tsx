'use client';

import { useState, useRef } from 'react';
import FloatingInput from '@/app/(components)/FloatingInput';
import { Inbox, AtSign, Smartphone, ImageIcon } from 'lucide-react';

interface Faculty {
  name: string;
  icon: File | null;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export default function FacultyForm() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [newFaculty, setNewFaculty] = useState<Faculty>({
    name: '',
    icon: null,
    address: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [dragOver, setDragOver] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewFaculty({ ...newFaculty, icon: file });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setNewFaculty({ ...newFaculty, icon: file });
    }
  };

  const addFaculty = () => {
    if (!newFaculty.name || !newFaculty.contactEmail || !newFaculty.contactPhone) {
      alert("Заполните все обязательные поля");
      return;
    }
    setFaculties([...faculties, newFaculty]);
    setNewFaculty({ name: '', icon: null, address: '', contactEmail: '', contactPhone: '' });
  };

  return (
    <section className="w-screen flex justify-center flex-col text-center px-4 mb-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Факультеты</h1>
      <p className="text-lg text-gray-600 mb-8">
        Укажите основную информацию факультета. Добавьте иконку, адрес и контактные данные. Вы можете создать несколько факультетов.
      </p>

      <div className="w-full max-w-2xl mx-auto mb-6 space-y-4">

        <FloatingInput
          label="Название факультета"
          id="faculty-name"
          value={newFaculty.name}
          onChange={(val) => setNewFaculty({ ...newFaculty, name: val })}
        />

        <FloatingInput
          label="Адрес факультета"
          id="faculty-address"
          value={newFaculty.address}
          onChange={(val) => setNewFaculty({ ...newFaculty, address: val })}
        />

        <FloatingInput
          label="Email факультета"
          id="faculty-email"
          type="email"
          value={newFaculty.contactEmail}
          onChange={(val) => setNewFaculty({ ...newFaculty, contactEmail: val })}
        />

        <FloatingInput
          label="Телефон факультета"
          id="faculty-phone"
          type="tel"
          value={newFaculty.contactPhone}
          onChange={(val) => setNewFaculty({ ...newFaculty, contactPhone: val })}
        />

        {/* drag'n'drop иконки */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputFileRef.current?.click()}
          className={`border-2 border-dashed rounded p-6 text-gray-500 cursor-pointer transition hover:border-blue-400 ${
            dragOver ? 'border-blue-600 bg-blue-50' : ''
          }`}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={inputFileRef}
            onChange={handleFileInput}
          />
          {newFaculty.icon ? (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              <p>{newFaculty.icon.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Inbox className="w-6 h-6" />
              <p>Перетащите иконку сюда или нажмите, чтобы выбрать</p>
            </div>
          )}
        </div>

        <button
          onClick={addFaculty}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Добавить факультет
        </button>
      </div>

      {/* Вывод списка факультетов (пока просто JSON) */}
      <pre className="text-left text-sm bg-gray-100 p-4 rounded max-w-2xl mx-auto mt-6 overflow-x-auto">
        {JSON.stringify(faculties, null, 2)}
      </pre>
    </section>
  );
}
