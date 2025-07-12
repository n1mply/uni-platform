'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ErrorAlertProps {
  errors: string[];
  duration?: number;
}

export default function ErrorAlert({ errors, duration = 4000 }: ErrorAlertProps){
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errors && errors.length > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [errors, duration]);

  if (!errors || errors.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-4 max-w-md">
            <AlertTriangle className="flex-shrink-0 mt-0.5" />
            <div className='flex flex-col gap-2'>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-left">
                  {error}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
