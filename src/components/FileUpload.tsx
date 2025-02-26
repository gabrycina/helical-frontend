import { useState, ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { uploadFile } from '@/lib/api';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (fileName: string) => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadFile(file);
      console.log('Upload result:', result); // Debug log
      
      // Make sure we're passing the correct filename from the response
      if (result && result.filename) {
        onFileUploaded(result.filename);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
          }
        }}
      >
        <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">Upload H5AD File</h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your file here or click to browse
        </p>
        <input
          type="file"
          ref={fileInputRef}
          accept=".h5ad"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button 
          variant="outline" 
          className="cursor-pointer"
          onClick={handleBrowseClick}
        >
          Browse Files
        </Button>
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}
      </div>
      
      {error && <p className="text-destructive">{error}</p>}
      
      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
} 