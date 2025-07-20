import { useState, useRef, useCallback } from 'react';
import { Inbox, Trash2 } from 'lucide-react';
import { ImageState } from '@/app/(context)/UniversityFormContext';

type DragConfig = {
    tabIndex?: number;
    image: ImageState;
    setImage: (image: ImageState) => void;
    fit?: boolean;
    w?: string;
    h?: string;
}

export default function DragNDrop({ tabIndex, image, setImage, fit = true, w = '', h = '' }: DragConfig) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImage({
                name: file.name,
                url: URL.createObjectURL(file),
            });
        } else {
            setImage(null);
        }
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const selectFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeImage = () => {
        if (image && image.url) {
            URL.revokeObjectURL(image.url);
        }
        setImage(null);
    };
    return (
        <div
            className={fit ? `relative lg:w-1/2 w-full border-3 rounded-xl mb-5 transition-all duration-300 ease-in-out
    ${isDragging ? 'border-indigo-50' : 'border-gray-100 hover:border-blue-700'}
    ${image ? 'border-solid' : ''}` : `relative ${w} ${h} border-3 rounded-xl mb-5 transition-all duration-300 ease-in-out
    ${isDragging ? 'border-indigo-50' : 'border-gray-100 hover:border-blue-700'}
    ${image ? 'border-solid' : ''}`
            }
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            onClick={!image ? selectFile : undefined}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                accept="image/*"
                tabIndex={tabIndex}
            />

            {image ? (
                <div className="relative text-center flex flex-col items-center justify-center h-40 md:h-48">
                    <img
                        src={image.url}
                        alt={image.name}
                        className="max-h-full max-w-full object-contain rounded-lg"
                    />
                    <button
                        tabIndex={tabIndex}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                        }}
                        className="absolute -bottom-0.5 -right-0.5 bg-gray-300 hover:bg-red-600 text-white rounded-[8px] p-1 shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
                        aria-label="Удалить изображение"
                    >
                        <Trash2 />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 md:h-48 cursor-pointer">
                    <Inbox color='#155DFC' size={48}></Inbox>
                </div>
            )}
        </div>
    );
}



