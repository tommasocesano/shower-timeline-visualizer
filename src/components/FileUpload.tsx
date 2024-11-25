import { useState } from "react";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface FileUploadProps {
  onDataLoaded: (data: any[][]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null // This ensures empty cells are represented as null
      }) as any[][];
      
      // Filter out completely empty rows
      const filteredData = jsonData.filter(row => row.some(cell => cell !== null));
      
      onDataLoaded(filteredData);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Error reading file. Please make sure it's a valid Excel file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Upload your shower program
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Drop your Excel file here or click to browse
        </p>
      </div>
    </div>
  );
};