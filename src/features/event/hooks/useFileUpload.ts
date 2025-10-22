import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (filename: string, progress: number) => void;
}

export const useFileUpload = (options: UploadOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const uploadFiles = useCallback(async (files: File[]) => {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/*', 'application/pdf'] } = options;
    
    // Validate files
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} quá lớn (tối đa ${maxSize / 1024 / 1024}MB)`);
        return null;
      }
      
      const isValidType = allowedTypes.some(type => 
        type.includes('*') ? file.type.startsWith(type.split('/')[0]) : file.type === type
      );
      
      if (!isValidType) {
        toast.error(`File ${file.name} không được hỗ trợ`);
        return null;
      }
    }

    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const progressValue = (e.loaded / e.total) * 100;
              setProgress(prev => ({ ...prev, [file.name]: progressValue }));
              options.onProgress?.(file.name, progressValue);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.open('POST', '/api/upload');
          xhr.send(formData);
        });
      });
      
      const results = await Promise.all(uploadPromises);
      toast.success(`Đã tải lên ${files.length} file thành công`);
      return results;
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải file');
      throw error;
    } finally {
      setUploading(false);
      setProgress({});
    }
  }, [options]);

  return { uploadFiles, uploading, progress };
};