"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Cropper, { Area } from 'react-easy-crop';

interface ImageUploadProps {
  value?: string;
  file?: File | null;
  onChange: (imageUrl: string) => void;
  onFileChange?: (file: File | null) => void;
  className?: string;
}

export default function ImageUpload({ value, file, onChange, onFileChange, className = '' }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(3 / 4);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Open crop modal before confirming selection
    // set temporary file on ref so cropper can access it
    tempFileRef.current = selectedFile;
    setShowCrop(true);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // temp file reference used while cropping
  const tempFileRef = useRef<File | null>(null);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  // helper to create image element from URL
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load error'));
      img.src = url;
    });

  // crop and return a File
  const getCroppedImageFile = async (file: File, cropArea: Area, mime = 'image/jpeg') => {
    const url = URL.createObjectURL(file);
    const image = await createImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(cropArea.width));
    canvas.height = Math.max(1, Math.round(cropArea.height));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.drawImage(
      image,
      Math.round(cropArea.x),
      Math.round(cropArea.y),
      Math.round(cropArea.width),
      Math.round(cropArea.height),
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        const croppedFile = new File([blob], file.name, { type: mime });
        resolve(croppedFile);
      }, mime, 0.92);
    });
  };

  const confirmCrop = async () => {
    try {
      const origFile = tempFileRef.current;
      if (!origFile || !croppedAreaPixels) return;
      const croppedFile = await getCroppedImageFile(origFile, croppedAreaPixels, origFile.type || 'image/jpeg');
      // create preview and notify parent
      const url = URL.createObjectURL(croppedFile);
      setPreviewUrl(url);
      if (onFileChange) onFileChange(croppedFile);
      setShowCrop(false);
    } catch (err) {
      console.error('Crop error', err);
      alert('Failed to crop image');
    }
  };

  const cancelCrop = () => {
    tempFileRef.current = null;
    setShowCrop(false);
    setPreviewUrl(null);
    if (onFileChange) onFileChange(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-sm p-6 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        style={{ opacity: 1 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {(previewUrl || value) && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Preview</label>
          <div className="relative w-32 h-32 rounded-sm overflow-hidden shadow-sm border">
            <Image
              src={previewUrl || value || ''}
              alt="Preview image"
              fill
              sizes="128px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
                onChange('');
                if (onFileChange) {
                  onFileChange(null);
                }
              }}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
          {file && (
            <div className="text-xs text-gray-500">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </div>
          )}
        </div>
      )}

      {/* Crop Modal */}
      {showCrop && (
        <div onClick={cancelCrop} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-sm shadow-lg w-full max-w-3xl p-4">
            <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
                <button type="button" onClick={() => setAspect(3/4)} className={`px-3 py-1 rounded-sm ${aspect === 3/4 ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>3:4</button>
                <button type="button" onClick={() => setAspect(3/5)} className={`px-3 py-1 rounded-sm ${aspect === 3/5 ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>3:5</button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Zoom</label>
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
              </div>
            </div>

            <div className="relative w-full h-[420px] bg-gray-100">
              <Cropper
                image={previewUrl || ''}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button type="button" className="px-4 py-2 bg-white rounded-sm shadow-sm" onClick={cancelCrop}>Cancel</button>
              <button type="button" className="px-4 py-2 bg-gray-900 text-white rounded-sm" onClick={confirmCrop}>Crop & Use</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
