// components/ExportButtons.js

export default function ExportButtons({ formattedCV, jobId }) { 
  const handleExport = (type) => {
    if (!jobId) {
      alert("No job ID available, cannot export");
      return;
    }
    const url = `http://localhost:4000/api/cv/export/${jobId}/${type}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={() => handleExport('pdf')}>Export PDF</button>
      <button onClick={() => handleExport('docx')} style={{ marginLeft: '10px' }}>Export DOCX</button>
    </div>
  );
}

