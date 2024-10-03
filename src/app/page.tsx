'use client'

import React, { useState, useEffect, useRef } from 'react';
import PdfViewer from './componnets/Pdfviewer';

export default function FileUploader() {
  const [fileSelect, setFileSelect] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileSelect) {
      console.log('File selected:', fileSelect.name);
    }
  }, [fileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const getFileType = (file: File): string => {
    const mimeType = file.type;
    
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType === 'application/pdf') return 'PDF';
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return 'Image';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return 'Video';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'Audio';
      case 'pdf':
        return 'PDF';
      default:
        return 'Unknown';
    }
  };

  const getMediaTag = (file: File): JSX.Element => {
    const fileType = getFileType(file);
    
    switch (fileType) {
      case 'Image':
        return <img src={URL.createObjectURL(file)} alt={file.name} />;
      case 'Video':
        return <video controls><source src={URL.createObjectURL(file)} type={file.type} /></video>;
      case 'Audio':
        return <audio controls><source src={URL.createObjectURL(file)} type={file.type} /></audio>;
      case 'PDF':
        return <PdfViewer file={file} />;
      default:
        return <p>Unsupported file type: {fileType}</p>;
    }
  };

  return (
    <>
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileChange} 
        id='fileInput' 
        accept=".jpg,.png,.pdf,.doc,.mp4,.mp3"
      />
      <button onClick={triggerFileInput}>Upload File</button>
      {fileSelect && (
        <div>
          <p>Selected file: {fileSelect.name}</p>
          <p>File size: {(fileSelect.size / 1024).toFixed(2)} KB</p>
          {getMediaTag(fileSelect)}
        </div>
      )}
    </>
  )
}