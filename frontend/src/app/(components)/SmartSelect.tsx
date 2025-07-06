import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface SmartSelect {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    id: string;
    label: string;
    tabIndex?: number;
}

export default function SmartSelect({ options, value, onChange, id, label, tabIndex }: SmartSelect) {
    const [inputValue, setInputValue] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            )
        );
    }, [inputValue, options]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setInputValue(option);
        setShowSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        setShowSuggestions(true);
    };

    return (
        <div className="mb-6 relative w-full lg:max-w-2xl" ref={wrapperRef}>
            <input
                type="text"
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                tabIndex={tabIndex}
                className="w-full px-4 pb-2 pt-6 peer block appearance-none border border-gray-300 rounded text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            />
            <label
                htmlFor={id}
                className={`absolute left-4 transition-all duration-200 select-none pointer-events-none 
                ${value
                        ? 'top-2 text-sm text-blue-600'
                        : 'top-3 text-base text-gray-400'
                    }
      peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
    `}
            >
                {label}
            </label>

            <AnimatePresence>
                {showSuggestions && filteredOptions.length > 0 && (
                    <motion.ul
                        key="suggestions"
                        initial="hidden"
                        animate="visible"
                        tabIndex={tabIndex}
                        exit="exit"
                        variants={{
                            hidden: { opacity: 0, y: -5 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.2,
                                    when: "beforeChildren",
                                    staggerChildren: 0.05,
                                },
                            },
                            exit: {
                                opacity: 0,
                                y: -5,
                                transition: { duration: 0.15 },
                            },
                        }}
                        className="scrollbar-hidden absolute z-10 w-full mt-1 max-h-66 overflow-auto border border-gray-300 bg-white rounded-md shadow-lg"
                    >
                        {filteredOptions.map((option, index) => (
                            <motion.li
                                key={index}
                                tabIndex={tabIndex}
                                onClick={() => handleSelect(option)}
                                variants={{
                                    hidden: { opacity: 0, y: -5 },
                                    visible: { opacity: 1, y: 0 },
                                    exit: { opacity: 0, y: -5 },
                                }}
                                className="p-2 hover:bg-blue-50 cursor-pointer text-center"
                            >
                                {option}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>


        </div>
    );
};