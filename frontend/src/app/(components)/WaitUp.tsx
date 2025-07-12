'use client'

import { motion } from "framer-motion";
import { MailCheck, Hourglass } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaitUp() {
    const router = useRouter();

    return (
        <motion.div
            className="w-screen flex flex-col text-center px-4 py-10 sm:px-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="border border-blue-400 mx-auto p-4 px-10 rounded-md flex flex-col items-center justify-center">
                <div className="bg-blue-600 text-white-800 p-6 rounded-full shadow-xl mb-6">
                    <motion.div
                        animate={{
                            rotate: [0, 0, 180, 180, 0],
                        }}
                        transition={{
                            duration: 2,
                            ease: [0.65, 0, 0.35, 1],
                            times: [0, 0.4, 0.5, 0.9, 1],
                            repeat: Infinity,
                            repeatDelay: 0
                        }}
                    >
                        <Hourglass className="w-12 h-12" color="#ffffff" />
                    </motion.div>
                </div>
                <div className="w-full lg:max-w-2xl flex flex-col">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-gray-900 mb-4">
                        Заявка отправлена
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-left w-full max-w-md">
                        Ваш университет был успешно создан и ожидает одобрения.
                        Ответ придёт на <span className="font-medium">указанную вами почту</span>, как только заявка будет рассмотрена.
                    </p>
                </div>

                <div className="flex flex-col w-full max-w-md  sm:flex-row items-center gap-4">
                    <button
                        onClick={() => router.push("/signin")}
                        className="flex items-center justify-center gap-2 text-center bg-blue-600 text-white w-full px-6 py-3 rounded hover:bg-blue-700 transition"
                    >
                        Войти
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
