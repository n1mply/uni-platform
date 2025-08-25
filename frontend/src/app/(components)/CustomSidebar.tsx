import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export type Option = {
  option: string;
  link: string;
};

export type SidebarItem = {
  option: string;
  links: Option[];
  icon: React.ReactNode;
};

export default function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth > 1024 && isMobile){
        setIsOpen(false)
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobile, isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
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

      {isOpen && (
        <div
          className="fixed inset-0 bg-black-900 bg-opacity-40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-full sm:min-w-1/2 ' : '-translate-x-full'} 
          lg:relative lg:translate-x-0 lg:w-64`}
        style={{borderRadius:"0 0 0px 0"}}
      >
        <div className="p-4 h-full flex flex-col">
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

          <nav className="mt-6 flex-1">
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index}>
                  {item.links.length === 1 ? (
                    <Link
                      href={item.links[0].link}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.option}</span>
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleItem(index)}
                        className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.option}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedItems.includes(index) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={16} className="text-gray-400" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.includes(index) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <ul className="ml-6 mt-2 space-y-1">
                              {item.links.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    href={subItem.link}
                                    className="block p-2 pl-4 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    onClick={() => isMobile && toggleSidebar()}
                                  >
                                    {subItem.option}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}