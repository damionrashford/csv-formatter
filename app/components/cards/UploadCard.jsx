import { useState, useRef, useEffect } from 'react';
import '../styles/cards.css';

function UploadCard({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      setFileInfo(null);
      return;
    }

    setError('');
    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
      lastModified: new Date(file.lastModified).toLocaleString()
    });
    
    // Read the file and pass it to the parent component
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        onFileUpload(content, file.name);
      } catch (error) {
        setError(`Error reading file: ${error.message}`);
      }
    };
    reader.onerror = () => setError('Error reading file');
    reader.readAsText(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="material-icon">cloud_upload</span>
        Upload CSV File
      </h2>
      
      <div 
        className={`upload-area ${dragActive ? 'highlight' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <span className="upload-icon">upload_file</span>
        <p>Drag and drop your CSV file here</p>
        <p>or</p>
        <input 
          ref={fileInputRef}
          type="file" 
          className="file-input" 
          accept=".csv" 
          onChange={handleChange}
        />
        <button className="btn" onClick={handleButtonClick}>
          <span className="material-icon">folder_open</span>
          Browse Files
        </button>
      </div>
      
      {fileInfo && (
        <div className="file-info">
          <span className="material-icon">description</span>
          <div className="file-details">
            <span className="file-name">{fileInfo.name}</span>
            <span className="file-meta">{fileInfo.size} • {fileInfo.lastModified}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          <span className="material-icon">error</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default UploadCard;