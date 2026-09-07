import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  const MAX_SIZE_MB = 50;

  const validateAndSetFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`Invalid file extension "${ext}". Accepted formats: PDF, DOC, DOCX, XLS, XLSX.`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds maximum limit of ${MAX_SIZE_MB} MB.`);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label 
        htmlFor="file-upload-input" 
        className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-widest"
      >
        Upload Cyber Insurance Questionnaire / Test Sheet *
      </label>

      {!selectedFile ? (
        <motion.div
          tabIndex={0}
          role="button"
          aria-label="Upload Cyber Insurance Questionnaire or Test Sheet. Press Enter or Space to select file."
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          animate={{
            borderColor: isDragging ? '#0284C7' : error ? '#F87171' : '#CBD5E1',
            backgroundColor: isDragging ? 'rgba(240, 249, 255, 0.9)' : '#F8FAFC',
            boxShadow: isDragging ? '0 0 25px rgba(2, 132, 199, 0.2)' : 'none',
          }}
          transition={{ duration: 0.2 }}
          className="border-2 border-dashed rounded-2xl p-8 sm:p-10 min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 focus-visible:outline-none hover:border-[#0284C7] hover:bg-sky-50/50 group"
        >
          <input
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleInputChange}
            aria-invalid={Boolean(error)}
            aria-describedby="file-upload-specs file-upload-error"
            className="sr-only"
          />

          <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0284C7] shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7 text-[#0284C7]" aria-hidden="true" />
          </div>

          <p className="text-sm font-bold text-slate-900">
            Click to select file <span className="font-normal text-slate-500">or drag & drop here</span>
          </p>

          <div id="file-upload-specs" className="text-xs font-mono text-slate-500 mt-2 space-y-1">
            <p><strong className="text-slate-700">Accepted formats:</strong> PDF, DOC, DOCX, XLS, XLSX</p>
            <p><strong className="text-slate-700">Maximum size:</strong> 50 MB</p>
          </div>
        </motion.div>
      ) : (
        /* Selected File Card */
        <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-[10px] font-mono text-emerald-700 font-semibold">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Verified Format
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" /> Ready
            </span>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-colors"
              title="Remove File"
              aria-label="Remove uploaded file"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p id="file-upload-error" role="alert" aria-live="polite" className="text-xs text-red-600 flex items-center gap-1 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};
