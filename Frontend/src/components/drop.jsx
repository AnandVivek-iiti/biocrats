import { useState, useCallback } from "react";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";

export default function DragDropUploader({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (incoming) => {
    const valid = Array.from(incoming).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.type.includes("word") ||
        file.type === "text/plain"
    );

    setFiles(valid);
    onFilesChange(valid);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  return (
    <div>
      {/* DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-400"}
        `}
      >
        <Upload className="mx-auto mb-2" />
        <p className="text-sm">
          Drag & drop files here or click to upload
        </p>

        <input
          type="file"
          multiple
          hidden
          id="fileInput"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* PREVIEW */}
      <div className="mt-4 space-y-2">
        {files.map((file, i) => (
          <div
            key={i}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div className="flex items-center gap-3">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FileText />
              )}
              <div>
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <X
              className="cursor-pointer"
              onClick={() => {
                const updated = files.filter((_, idx) => idx !== i);
                setFiles(updated);
                onFilesChange(updated);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
