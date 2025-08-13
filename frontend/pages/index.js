import { useState } from 'react';
import DragDropUploader from '../components/DragDropUploader';
import CVRenderer from '../components/CVRenderer';
import ExportButtons from '../components/ExportButtons';

export default function Home() {
  const [originalText, setOriginalText] = useState('');
  const [formattedCV, setFormattedCV] = useState(null);
  const [jobId, setJobId] = useState(null);

  // Called when uploader finishes both extraction & AI formatting
  const handleUploadComplete = (extractedText, aiFormattedCV,newJobId) => {
    setOriginalText(extractedText);
    setFormattedCV(aiFormattedCV);
    setJobId(newJobId);
  };

  // Called when editing inside CVRenderer
  const handleEdit = (updatedCV) => {
    setFormattedCV(updatedCV);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>AI‑Powered CV Formatter</h1>

     <DragDropUploader onComplete={handleUploadComplete}
       />
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Left Pane */}
        <div style={{ width: '45%' }}>
          <h2>Original Extracted Text</h2>
          <textarea
            readOnly
            value={originalText}
            style={{
              width: '100%',
              height: '500px',
              background: '#fafafa',
              padding: '10px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Right Pane */}
        <div style={{ width: '55%' }}>
          <h2>Formatted CV</h2>
          {formattedCV ? (
            <CVRenderer formattedCV={formattedCV} onEdit={handleEdit} />
          ) : (
            <p>No formatted CV yet. Upload a file to see preview.</p>
          )}
        </div>
      </div>

      {/* Export only if we have a formatted CV */}
      {formattedCV && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          
          <ExportButtons jobId={jobId} /> 
        </div>
      )}
    </div>
  );
}
