import { useState, useRef, useCallback } from 'react';
import { Inbox, Trash2 } from 'lucide-react';
import { ImageState } from '@/app/(context)/UniversityFormContext';
import Image from 'next/image'

interface DragConfig {
  tabIndex?: number;
  image: ImageState;
  setImage: (image: ImageState) => void;
  proportion?: boolean; // сохраняет пропорции 1:1
  height: string;       // высота контейнера (и ширина, если пропорции)
  label?: string;
}

export default function DragNDrop({
  tabIndex,
  image,
  setImage,
  proportion = true,
  height,
  label = '',
}: DragConfig) {
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
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
  };

  // Compute classes
  const containerClasses = [
    'relative',
    'border-2',
    'border-dashed',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'overflow-hidden',
    isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-600',
    image ? 'border-solid' : '',
  ].join(' ');

  const sizeStyles: React.CSSProperties = proportion
    ? { width: height, height }
    : { width: '100%', height };

  const imgClassName = proportion
    ? 'w-full h-full object-cover'
    : 'max-w-full max-h-full object-contain mx-auto my-auto';

  return (
    <div
      className={containerClasses}
      style={sizeStyles}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onClick={!image ? selectFile : undefined}
      tabIndex={tabIndex}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />

      {image ? (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* <Image
            src={image.url}
            className={imgClassName}
            width={2}
            height={2}
            alt=''
          /> */}

          <img
            src={image.url}
            alt={image.name}
            className={imgClassName}
          />

          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 rounded-lg p-1 shadow-md focus:outline-none"
            aria-label="Удалить изображение"
          >
            <Trash2 className='hover:scale-[0.99] transition-all duration-200' size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <Inbox size={48} className="text-blue-500 mb-2" />
          {label ? <span className="text-sm text-gray-500 font-medium max-w-lg mx-auto text-center">{label}</span> : <div></div>}
        </div>
      )}
    </div>
  );
}
