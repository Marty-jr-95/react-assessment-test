import React, { useState } from 'react';
import axios from 'axios';
import DisplayVideo from '../DisplayVideo/DisplayVideo';

interface Props {}

const UploadVideo: React.FC<Props> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
   const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const { data } = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || file.size;
            setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
          },
        }
      );
      console.log(data);
      setFileUrl(data.fileUrl);
      setIsUploading(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <label htmlFor="file-input">Select a File</label>
      <input id="file-input" type="file" onChange={handleFileSelect} />
      <button disabled={!file || isUploading} onClick={handleUpload}>
        {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
      </button>
      {fileUrl && <DisplayVideo fileUrl={fileUrl} />}
    </div>
  );
};

export default UploadVideo;
