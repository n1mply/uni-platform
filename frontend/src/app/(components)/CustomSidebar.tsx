import { useState, useEffect } from 'react';
import Link from 'next/link';

export type SidebarItem = {
  option: string;
  link: string;
  icon: React.ReactNode;
};

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Кнопка открытия (только на мобильных) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-md lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black-900 bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Сайдбар */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'min-w-1/2' : '-translate-x-full'} 
          lg:relative lg:translate-x-0 lg:w-64 min-h-screen`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Кнопка закрытия */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="self-end lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Навигация */}
          <nav className="mt-6 flex-1">
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => isMobile && toggleSidebar()}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.option}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}