'use client';

import { ChangeEvent, useState } from 'react';

interface DocumentUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  isLoading?: boolean;
}

export default function DocumentUploader({ onFilesSelected, isLoading }: DocumentUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
    onFilesSelected?.(files);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    onFilesSelected?.([]);
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-blue-400 transition-colors">
        <label className="block cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Click to select files</span>
            <span className="text-xs text-gray-500">PDF files will be merged into your downloaded form</span>
            <span className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX — max 25 MB per file</span>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-green-900">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </p>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                {selectedFiles.map(f => (
                  <li key={f.name} className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{f.name}</span>
                    <span className="text-green-600 shrink-0">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="text-sm text-green-700 hover:text-green-900 font-semibold ml-4 shrink-0"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
