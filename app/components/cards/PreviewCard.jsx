import { useState } from 'react';
import '../styles/cards.css';

function PreviewCard({ 
  formattedData, 
  headers = [], 
  rows = [], 
  stats = { rowCount: 0, columnCount: 0, cellCount: 0 },
  extraction = null,
  onDownload
}) {
  const [activeTab, setActiveTab] = useState('table');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const copyExtractedValues = () => {
    if (extraction && extraction.values) {
      copyToClipboard(extraction.values);
    }
  };

  return (
    <div className="card preview-container">
      <h2 className="card-title">
        <span className="material-icon">preview</span>
        Preview Results
      </h2>
      
      <div className="preview-tabs">
        <div 
          className={`preview-tab ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => handleTabChange('table')}
        >
          Table View
        </div>
        <div 
          className={`preview-tab ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => handleTabChange('raw')}
        >
          Raw CSV
        </div>
      </div>
      
      <div className={`preview-content ${activeTab === 'table' ? 'active' : ''}`} id="tablePreview">
        <div className="table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
              {rows.length > 10 && (
                <tr>
                  <td colSpan={headers.length} className="more-rows">
                    {rows.length - 10} more rows (not shown in preview)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={`preview-content ${activeTab === 'raw' ? 'active' : ''}`} id="rawPreview">
        <div className="raw-data">
          {formattedData || ''}
        </div>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{stats.rowCount}</div>
          <div className="stat-label">Rows Processed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.columnCount}</div>
          <div className="stat-label">Columns</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.cellCount}</div>
          <div className="stat-label">Cells Formatted</div>
        </div>
      </div>
      
      <div className="alert alert-success">
        <span className="material-icon">check_circle</span>
        CSV successfully formatted!
      </div>
      
      {extraction && extraction.values && (
        <div className="extraction-result">
          <h3 className="card-subtitle">
            <span className="material-icon">format_list_bulleted</span>
            Extracted Values
          </h3>
          <div className="stats-mini">
            <span>{extraction.count}</span> values extracted from column "<span>{extraction.columnName}</span>"
          </div>
          <div className="extracted-values">
            {extraction.values}
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={copyExtractedValues}
            style={{ marginTop: '12px' }}
          >
            <span className="material-icon">content_copy</span>
            Copy Extracted Values
          </button>
        </div>
      )}
      
      <div className="btn-group">
        <button 
          className="btn"
          onClick={onDownload}
        >
          <span className="material-icon">download</span>
          Download CSV
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => copyToClipboard(formattedData)}
        >
          <span className="material-icon">content_copy</span>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}

export default PreviewCard;