/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import MessageAlert from "../(components)/CustomAlert";

type AlertContext = {
    showAlert: (messages: string[], isError?: boolean) => void;
    hideAlert: () => void;
}

const AlertMessagesContext = createContext<AlertContext | null>(null);

export function AlertMessagesProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<string[]>([]);
    const [isError, setIsError] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const showAlert = (newMessages: string[], error = true) => {
        setMessages(newMessages);
        setIsError(error);
        setIsVisible(true);
    };

    const hideAlert = () => {
        setIsVisible(false);
        setMessages([]);
    };

    const afterDelay = () => {
        setMessages([]);
    };

    const value = useMemo(() => ({
        showAlert,
        hideAlert
    }), []);

    return (
        <AlertMessagesContext.Provider value={value}>
            <MessageAlert
                messages={messages}
                isError={isError}
                afterDelay={afterDelay}
                duration={4000}
            />
            {children}
        </AlertMessagesContext.Provider>
    );
}

export function useAlertContext() {
    const context = useContext(AlertMessagesContext);
    if (!context) {
        throw new Error("useAlertContext must be used within AlertMessagesContext");
    }
    return context;
}