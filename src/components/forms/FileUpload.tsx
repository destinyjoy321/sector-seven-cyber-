import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt', '.png', '.jpg', '.jpeg', '.zip'];
  const MAX_SIZE_MB = 50;

  const validateAndSetFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`Invalid file extension "${ext}". Allowed formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, PNG, JPG, ZIP.`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds maximum limit of ${MAX_SIZE_MB}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
        Upload Cyber Insurance Questionnaire / Test Sheet *
      </label>

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-cyber-teal bg-cyber-teal-tint/80 scale-[1.01]'
              : error
              ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
              : 'border-slate-300 bg-slate-50/80 hover:bg-white hover:border-cyber-teal/60 hover:shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-cyber-teal shadow-sm mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-900">
            Click to upload <span className="font-normal text-slate-500">or drag & drop file</span>
          </p>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Accepted formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, PNG, JPG, ZIP (Max 50 MB)
          </p>


          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
            <Lock className="w-3 h-3 text-cyber-teal" />
            <span>Private Storage Bucket (Encrypted 256-Bit AES)</span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-[10px] font-mono text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Verified Format
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
            </span>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
