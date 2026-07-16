'use client';

import { ChangeEvent, useState } from 'react';

interface DocumentUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB — must match the copy below
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

/**
 * Pure file picker: validates size/type and hands accepted files to the
 * parent, which owns the authoritative file list (with per-file Remove).
 * Keeping no internal list avoids two out-of-sync lists on screen.
 */
export default function DocumentUploader({ onFilesSelected, isLoading }: DocumentUploaderProps) {
  const [rejectedMessages, setRejectedMessages] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const rejected: string[] = [];
    const accepted: File[] = [];

    for (const file of files) {
      const dot = file.name.lastIndexOf('.');
      const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        rejected.push(`${file.name} is not an accepted file type. Please upload a PDF, JPG, PNG, DOC, or DOCX file.`);
      } else if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 25 MB per file.`);
      } else {
        accepted.push(file);
      }
    }

    setRejectedMessages(rejected);
    if (accepted.length > 0) onFilesSelected?.(accepted);
    // Reset so picking the same file again (e.g. after removing it) re-fires onChange
    e.target.value = '';
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

      {rejectedMessages.length > 0 && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
          {rejectedMessages.map((msg, i) => (
            <p key={i} className="text-sm text-red-800">{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
