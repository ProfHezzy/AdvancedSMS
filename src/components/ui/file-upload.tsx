import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in MB
    acceptedTypes?: string[];
    className?: string;
}

export function FileUpload({
    onFilesSelected,
    maxFiles = 5,
    maxSize = 10,
    acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
    className
}: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
        onDrop,
        maxFiles,
        maxSize: maxSize * 1024 * 1024,
        accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
    });

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    isDragActive ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/30"
                )}
            >
                <input {...getInputProps()} />
                <Upload className={cn(
                    "w-12 h-12 mx-auto mb-4",
                    isDragActive ? "text-brand-600" : "text-gray-400"
                )} />
                {isDragActive ? (
                    <p className="font-bold text-brand-600">Drop files here...</p>
                ) : (
                    <>
                        <p className="font-bold text-gray-900 mb-1">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Max {maxFiles} files, up to {maxSize}MB each
                        </p>
                    </>
                )}
            </div>

            {acceptedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-700">Selected Files:</p>
                    {acceptedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-brand-50 border border-brand-100">
                            <File className="w-4 h-4 text-brand-600" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {fileRejections.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-bold text-red-600">Rejected Files:</p>
                    {fileRejections.map(({ file, errors }, index) => (
                        <div key={index} className="p-3 rounded-lg bg-red-50 border border-red-100">
                            <p className="text-sm font-bold text-red-900">{file.name}</p>
                            {errors.map((error, i) => (
                                <p key={i} className="text-xs text-red-600">{error.message}</p>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
