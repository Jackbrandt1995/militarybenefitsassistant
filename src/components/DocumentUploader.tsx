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
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">Required/Recommended Supporting Documents</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ DD Form 214 or similar discharge papers (proof of service)</li>
          <li>✓ Voided blank check or bank account verification (for direct deposit)</li>
          <li>✓ VA Form 22-1999 (Statement of Benefits - if applicable)</li>
          <li>✓ NOBE (Notice of Basic Eligibility) letter</li>
          <li>✓ Any conditional approval letters or STEM kicker contract</li>
          <li>○ Birth certificate (recommended)</li>
          <li>○ Marriage certificate (if applicable)</li>
          <li>○ Divorce decree (if applicable)</li>
          <li>○ Proof of high school diploma or GED</li>
          <li>○ Official college transcripts (if transferring credits)</li>
        </ul>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700 block mb-2">
            Upload Supporting Documents
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            className="block w-full text-sm"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.tiff"
          />
          <p className="text-xs text-gray-500 mt-2">
            Max 25 MB per file. Supported: PDF, DOC, DOCX, JPG, PNG, GIF, TIFF
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-green-900">
                {selectedFiles.length} file(s) selected
              </p>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                {selectedFiles.map(f => (
                  <li key={f.name} className="truncate">
                    • {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="text-sm text-green-700 hover:text-green-900 font-semibold ml-4"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
