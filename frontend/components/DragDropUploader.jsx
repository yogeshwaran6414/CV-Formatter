import React, { useState } from 'react';
import axios from 'axios';
import CvPreview from './CvPreview'; // Optional preview inside uploader

export default function DragDropUploader({ onComplete }) {
  const [formatted, setFormatted] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // 1️⃣ Step 1 - Upload file for extraction
      const form = new FormData();
      form.append('file', file);

      const uploadRes = await axios.post(
        'http://localhost:4000/api/cv/upload',
        form
      );

      const extractedText = uploadRes.data.extractedText;
      setOriginalText(extractedText);

      // 2️⃣ Step 2 - Process extracted text into AI-formatted CV
      const processRes = await axios.post(
        'http://localhost:4000/api/cv/process',
        { extractedText }
      );

      const formattedCV = processRes.data.formattedCV;
      const jobIdFromServer = processRes.data.id || null;

      setFormatted(formattedCV);
      setJobId(jobIdFromServer);

      // 3️⃣ Pass everything to parent for side-by-side view + export
      if (typeof onComplete === 'function') {
        onComplete(extractedText, formattedCV, jobIdFromServer);
      }
    } catch (err) {
      console.error('Upload/Processing error:', err);
      alert('Upload or processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px',
      }}
    >
      {loading ? <p>Processing...</p> : <p>Drag & drop CV here</p>}

      {/* If you want inline preview inside uploader */}
      {formatted && (
        <CvPreview
          formatted={formatted}
          originalText={originalText}
          jobId={jobId}
        />
      )}
    </div>
  );
}
