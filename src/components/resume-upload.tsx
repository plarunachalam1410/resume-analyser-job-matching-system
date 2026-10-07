"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

export default function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = (selectedFile: File) => {
    setMessage("");

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setMessage("Only PDF files are supported.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setMessage("Resume must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please select a PDF resume first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to analyze resume.");
      }

      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragging
            ? "border-white bg-white/10"
            : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">
          ↑
        </div>

        {file ? (
          <>
            <p className="font-medium text-white">{file.name}</p>
            <p className="mt-2 text-sm text-white/50">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-white">
              Drop your resume here
            </p>
            <p className="mt-2 text-sm text-white/50">
              or click to browse • PDF only • Max 5 MB
            </p>
          </>
        )}
      </div>

      {message && (
        <p className="text-sm text-white/70">
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || isUploading}
        className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {isUploading ? "Uploading..." : "Analyze Resume"}
      </button>
    </div>
  );
}