'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MessageAlertProps {
  messages: string[];
  duration?: number;
  isError?: boolean;
  afterDelay?: () => void;
}

export default function MessageAlert({ 
  messages, 
  duration = 4000, 
  isError = true,
  afterDelay
}: MessageAlertProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Вызываем колбэк после скрытия уведомления
        afterDelay?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [messages, duration, afterDelay]);

  if (!messages || messages.length === 0) return null;

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
          <div className={`
            ${isError ? 'bg-red-500' : 'bg-gray-100'} 
            text-${isError ? 'white' : 'gray-800'} 
            px-4 py-3 rounded-md shadow-lg flex items-center gap-4 max-w-md
          `}>
            {isError ? (
              <AlertTriangle className="flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="flex-shrink-0 mt-0.5 text-blue-500" />
            )}
            <div className='flex flex-col gap-2'>
              {messages.map((message, index) => (
                <p key={index} className="text-sm text-left">
                  {message}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};