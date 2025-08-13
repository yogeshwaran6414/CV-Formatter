import React, { useState } from 'react';

// Reusable inline editable field
const EditableField = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '10px' }}>
    {label && <strong>{label}: </strong>}
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        border: 'none',
        borderBottom: '1px solid #ccc',
        background: '#f9f9f9',
        fontFamily: 'Palatino Linotype, serif',
        fontSize: '15px'
      }}
    />
  </div>
);

export default function CvPreview({ formatted, originalText, onEdit }) {
  const [localCV, setLocalCV] = useState(formatted);

  const handleEdit = (section, key, value) => {
    const updated = { ...localCV };
    if (section && key) {
      updated[section][key] = value;
    } else if (section) {
      updated[section] = value;
    }
    setLocalCV(updated);
    onEdit && onEdit(updated);
  };

  if (!localCV) return <p>No CV to preview.</p>;

  return (
    <div style={{
      fontFamily: 'Palatino Linotype, serif',
      background: '#fff',
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '20px',
      width: '100%',
      maxWidth: '750px'
    }}>
      {/* Header */}
      <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>
        {localCV.header?.name}
      </h2>
      <h4 style={{ textAlign: 'center', fontWeight: 'normal', color: '#555', marginTop: 0 }}>
        {localCV.header?.title}
      </h4>
      <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>
        {localCV.header?.email} | {localCV.header?.phone}
      </div>

      {/* Profile */}
      <section>
        <h3>Profile</h3>
        <EditableField
          value={localCV.profile}
          onChange={val => handleEdit('profile', null, val)}
        />
      </section>

      {/* Languages */}
      {localCV.languages && (
        <section>
          <h3>Languages</h3>
          <ul>
            {Object.entries(localCV.languages).map(([lang, level], idx) => (
              <li key={idx}>{lang}: {level}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {localCV.skills && (
        <section>
          <h3>Skills</h3>
          <ul>
            {localCV.skills.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </section>
      )}

      {/* Experience */}
      {localCV.professional_experience && (
        <section>
          <h3>Professional Experience</h3>
          {localCV.professional_experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <strong>{exp.position}</strong> — {exp.company} ({exp.dates})
              {exp.responsibilities && (
                <ul>
                  {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {localCV.education && (
        <section>
          <h3>Education</h3>
          <p>
            <strong>{localCV.education.degree}</strong> — {localCV.education.institution} ({localCV.education.date})<br />
            {localCV.education.location}
          </p>
        </section>
      )}

      {/* Interests */}
      {localCV.interests && (
        <section>
          <h3>Interests</h3>
          <p>{localCV.interests}</p>
        </section>
      )}
    </div>
  );
}
