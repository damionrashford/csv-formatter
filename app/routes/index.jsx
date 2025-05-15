import { useState } from 'react';
import UploadCard from '../components/cards/UploadCard.jsx';
import FormatOptionsCard from '../components/cards/FormatOptionsCard.jsx';
import PreviewCard from '../components/cards/PreviewCard.jsx';
import useCSVProcessor from '../hooks/useCSVProcessor.js';
import Layout from '../components/Layout.jsx';
import { setItem, getItem } from '../hooks/useLocalStorage.js';
import { downloadFile } from '../components/utils/FileHandler.jsx';

export default function Index() {
  const [csvText, setCSVText] = useState('');
  const [fileName, setFileName] = useState('formatted.csv');
  const [step, setStep] = useState(0);
  const {
    headers, rows, formatted, stats, extraction, error, processCSV, reset
  } = useCSVProcessor();
  const [isLoading, setIsLoading] = useState(false);

  function handleFileUpload(text, name) {
    setCSVText(text);
    setFileName(name || 'formatted.csv');
    setStep(1);
    setItem('lastFile', { text, name });
  }

  function handleProcess(transformations, options, extractionOptions) {
    setIsLoading(true);
    setTimeout(() => {
      processCSV(csvText, transformations, options, extractionOptions);
      setIsLoading(false);
      setStep(2);
    }, 300);
  }

  function handleReset() {
    reset();
    setCSVText('');
    setStep(0);
  }

  function handleDownload() {
    downloadFile(fileName.replace(/\.csv$/i, '') + '-formatted.csv', formatted);
  }

  return (
    <Layout>
      {step === 0 && <UploadCard onFileUpload={handleFileUpload} />}
      {step === 1 && (
        <FormatOptionsCard 
          csvHeaders={headers}
          onProcessCSV={handleProcess}
          onReset={handleReset}
          isLoading={isLoading}
        />
      )}
      {step === 2 && (
        <PreviewCard 
          formattedData={formatted}
          headers={headers}
          rows={rows}
          stats={stats}
          extraction={extraction}
          onDownload={handleDownload}
        />
      )}
      {error && <div className="alert alert-error">{error}</div>}
    </Layout>
  );
}
