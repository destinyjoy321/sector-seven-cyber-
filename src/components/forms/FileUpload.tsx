import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFiles, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  const MAX_SINGLE_FILE_MB = 10;
  const MAX_TOTAL_MB = 50;
  const MAX_FILE_COUNT = 5;

  const currentTotalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const validateAndAddFiles = (incomingList: FileList | File[]) => {
    const incomingArray = Array.from(incomingList);
    if (incomingArray.length === 0) return;

    if (selectedFiles.length + incomingArray.length > MAX_FILE_COUNT) {
      alert(`Maximum file limit reached: You can upload up to ${MAX_FILE_COUNT} files total.`);
      return;
    }

    const updatedList = [...selectedFiles];
    let runningTotalBytes = currentTotalBytes;

    for (const file of incomingArray) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        alert(`Invalid file format for "${file.name}". Accepted formats: PDF, DOC, DOCX, XLS, XLSX.`);
        return;
      }

      if (file.size > MAX_SINGLE_FILE_MB * 1024 * 1024) {
        alert(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum individual limit of ${MAX_SINGLE_FILE_MB} MB.`);
        return;
      }

      if (runningTotalBytes + file.size > MAX_TOTAL_MB * 1024 * 1024) {
        alert(`Adding "${file.name}" would exceed the maximum total aggregate size of ${MAX_TOTAL_MB} MB.`);
        return;
      }

      // Check duplicate file
      if (!updatedList.some(f => f.name === file.name && f.size === file.size)) {
        updatedList.push(file);
        runningTotalBytes += file.size;
      }
    }

    onFileSelect(updatedList);
  };

  const removeFile = (indexToRemove: number) => {
    const updated = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    onFileSelect(updated);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // Reset input value so re-selecting same file works if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <label 
          htmlFor="file-upload-input" 
          className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-widest"
        >
          Upload Your Cyber Insurance Questionnaire (PDF, DOCX, XLSX) *
        </label>
        {selectedFiles.length > 0 && (
          <span className="text-[11px] font-mono font-bold text-[#0284C7]">
            {selectedFiles.length} of {MAX_FILE_COUNT} Files ({ (currentTotalBytes / (1024 * 1024)).toFixed(1) } / {MAX_TOTAL_MB} MB)
          </span>
        )}
      </div>

      {selectedFiles.length < MAX_FILE_COUNT && (
        <motion.div
          tabIndex={0}
          role="button"
          aria-label="Upload Cyber Insurance Questionnaires. Press Enter or Space to select files."
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
          className="border-2 border-dashed rounded-2xl p-6 sm:p-8 min-h-[140px] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 focus-visible:outline-none hover:border-[#0284C7] hover:bg-sky-50/50 group"
        >
          <input
            id="file-upload-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleInputChange}
            aria-invalid={Boolean(error)}
            aria-describedby="file-upload-specs file-upload-error"
            className="sr-only"
          />

          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0284C7] shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 text-[#0284C7]" aria-hidden="true" />
          </div>

          <p className="text-sm font-bold text-slate-900">
            Click to select files <span className="font-normal text-slate-500">or drag & drop here</span>
          </p>

          <div id="file-upload-specs" className="text-xs font-mono text-slate-500 mt-1.5 space-y-0.5">
            <p><strong className="text-slate-700">Accepted formats:</strong> PDF, DOC, DOCX, XLS, XLSX</p>
            <p><strong className="text-slate-700">Limits:</strong> Up to 5 files (Max 10 MB per file, 50 MB total combined)</p>
          </div>
        </motion.div>
      )}

      {/* Selected File Cards List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {selectedFiles.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-3 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] font-mono text-emerald-700 font-semibold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Verified Format
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" /> Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-colors"
                    title="Remove file"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Helper Text Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-normal">
        Please upload either your new insurance application form or your current policy review document. Our compliance engineering team will perform an instant gap analysis to ensure your technical architecture fully satisfies underwriting requirements. This questionnaire is typically a PDF or Excel document emailed to you by your independent commercial insurance broker during your annual coverage renewal cycle. Search your business inbox for "Cyber Questionnaire," "Cyber Liability Supplement," or contact your commercial insurance broker directly to request a digital copy.
      </div>

      {error && (
        <p id="file-upload-error" role="alert" aria-live="polite" className="text-xs text-red-600 flex items-center gap-1 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};
