import React, { useState } from 'react';
import axios from 'axios';

export default function InlineEditor({ jobId, formatted }) {
  const [content, setContent] = useState(formatted);

  const handleExport = async fmt => {
    const res = await axios.get(`http://localhost:4000/api/cv/export/${jobId}/${fmt}`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${content.header.name}.${fmt}`;
    anchor.click();
  };

  return content ? (
    <div>
      <h3>Edit & Export</h3>
      <textarea
        style={{ width: '100%', height: '300px' }}
        value={JSON.stringify(content, null, 2)}
        onChange={e => {
          try {
            setContent(JSON.parse(e.target.value));
          } catch {}
        }}
      />
      <button onClick={() => handleExport('pdf')}>Export PDF</button>
      <button onClick={() => handleExport('docx')}>Export DOCX</button>
    </div>
  ) : null;
}
