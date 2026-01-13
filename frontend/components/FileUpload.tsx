"use client";
import { Upload } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

export function FileUpload(setError: any) {
    const [fileName, setFileName] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Process your CSV file here
      console.log('File selected:', file);
    }
  };

  return (
    <div className="absolute h-full w-50 right-0 p-2 bg-gray-900 border border-white/20">
        <h2 className='text-bold text-xl border-b-2 border-gray-50 mb-3'>Upload CSV file with "country" or "city" column</h2>
      <div className="w-full max-w-md">
        <label
          htmlFor="csv-upload"
          className="flex flex-col items-center justify-center w-full h-44 p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-center text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop CSV file here    
            </p>
            {fileName && (
              <p className="mt-4 text-sm text-gray-50 font-medium">
                {fileName}
              </p>
            )}
          </div>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
