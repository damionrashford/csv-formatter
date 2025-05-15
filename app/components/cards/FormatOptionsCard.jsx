import { useState, useEffect } from 'react';
import '../styles/cards.css';

function FormatOptionsCard({ 
  csvHeaders, 
  onProcessCSV, 
  onReset,
  isLoading = false 
}) {
  const [transformations, setTransformations] = useState([]);
  const [options, setOptions] = useState({
    skipHeaders: true,
    trimWhitespace: true,
    skipEmptyRows: true
  });
  const [extractionOptions, setExtractionOptions] = useState({
    enabled: false,
    columnIndex: 0,
    format: 'comma',
    customSeparator: '',
    uniqueOnly: true
  });

  // Update transformations when headers change
  useEffect(() => {
    if (csvHeaders && csvHeaders.length) {
      setTransformations(
        csvHeaders.map((header, index) => ({
          index,
          type: 'none',
          format: ''
        }))
      );
      
      // Reset extraction column index to first column
      setExtractionOptions(prev => ({
        ...prev,
        columnIndex: 0
      }));
    }
  }, [csvHeaders]);

  const updateTransformation = (index, field, value) => {
    setTransformations(prev => 
      prev.map((item, i) => 
        i === index 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleExtractionEnabledChange = (e) => {
    setExtractionOptions(prev => ({
      ...prev,
      enabled: e.target.checked
    }));
  };

  const handleExtractionOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExtractionOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProcessClick = () => {
    onProcessCSV(transformations, options, extractionOptions);
  };

  return (
    <div className="card format-options">
      <h2 className="card-title">
        <span className="material-icon">tune</span>
        Formatting Options
      </h2>
      
      <div className="option-group">
        <label className="option-label">Column Transformations</label>
        <div className="column-options">
          {csvHeaders && csvHeaders.map((header, index) => (
            <div className="option-row" key={index}>
              <input 
                type="text" 
                className="option-input" 
                value={header} 
                readOnly 
              />
              <select 
                className="option-input"
                value={transformations[index]?.type || 'none'}
                onChange={(e) => updateTransformation(index, 'type', e.target.value)}
              >
                <option value="none">No transformation</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize</option>
                <option value="trim">Trim whitespace</option>
                <option value="number">Format as number</option>
                <option value="currency">Format as currency</option>
                <option value="date">Format as date</option>
                <option value="remove">Remove column</option>
              </select>
              <input 
                type="text" 
                className="option-input"
                placeholder="Format pattern (if applicable)"
                value={transformations[index]?.format || ''}
                onChange={(e) => updateTransformation(index, 'format', e.target.value)}
                style={{ 
                  display: ['number', 'currency', 'date'].includes(transformations[index]?.type) 
                    ? 'block' 
                    : 'none' 
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="option-group">
        <label className="option-label">General Options</label>
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="skipHeadersOption" 
            name="skipHeaders"
            checked={options.skipHeaders}
            onChange={handleOptionChange}
          />
          <label htmlFor="skipHeadersOption">Keep original headers</label>
        </div>
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="trimWhitespaceOption" 
            name="trimWhitespace"
            checked={options.trimWhitespace}
            onChange={handleOptionChange}
          />
          <label htmlFor="trimWhitespaceOption">Trim whitespace from cells</label>
        </div>
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="skipEmptyRowsOption" 
            name="skipEmptyRows"
            checked={options.skipEmptyRows}
            onChange={handleOptionChange}
          />
          <label htmlFor="skipEmptyRowsOption">Skip empty rows</label>
        </div>
      </div>
      
      <div className="option-group">
        <label className="option-label">Value Extraction</label>
        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="enableExtractionOption"
            checked={extractionOptions.enabled}
            onChange={handleExtractionEnabledChange}
          />
          <label htmlFor="enableExtractionOption">Extract values from column</label>
        </div>
        
        {extractionOptions.enabled && (
          <div className="extraction-options">
            <div className="option-row">
              <select 
                className="option-input"
                name="columnIndex"
                value={extractionOptions.columnIndex}
                onChange={handleExtractionOptionChange}
              >
                {csvHeaders && csvHeaders.map((header, index) => (
                  <option key={index} value={index}>{header}</option>
                ))}
              </select>
              <select 
                className="option-input"
                name="format"
                value={extractionOptions.format}
                onChange={handleExtractionOptionChange}
              >
                <option value="comma">Comma separated</option>
                <option value="newline">New line separated</option>
                <option value="semicolon">Semicolon separated</option>
                <option value="custom">Custom separator</option>
              </select>
              {extractionOptions.format === 'custom' && (
                <input 
                  type="text" 
                  className="option-input"
                  name="customSeparator"
                  placeholder="Custom separator"
                  value={extractionOptions.customSeparator}
                  onChange={handleExtractionOptionChange}
                />
              )}
            </div>
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="extractionUniqueOption"
                name="uniqueOnly"
                checked={extractionOptions.uniqueOnly}
                onChange={handleExtractionOptionChange}
              />
              <label htmlFor="extractionUniqueOption">Extract unique values only</label>
            </div>
          </div>
        )}
      </div>
      
      <div className="btn-group">
        <button 
          className="btn"
          onClick={handleProcessClick}
          disabled={isLoading || !csvHeaders || csvHeaders.length === 0}
        >
          <span className="material-icon">auto_fix_high</span>
          {isLoading ? 'Processing...' : 'Process CSV'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onReset}
        >
          <span className="material-icon">refresh</span>
          Reset
        </button>
      </div>
    </div>
  );
}

export default FormatOptionsCard;