import React from "react";

export default function CVRenderer({ formattedCV }) {
  if (!formattedCV) return <div>Waiting for formatted CV...</div>;

  return (
    <div
      style={{
        fontFamily: "'Palatino Linotype', serif",
        background: "#fff",
        padding: "40px",
        maxWidth: "800px",
        margin: "auto",
        lineHeight: "1.5",
      }}
    >
      {/* Header Logos */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/ehs-logo.png" alt="EHS Logo" style={{ height: "50px" }} />
        <img src="/exclusive-nannies-logo.png" alt="Nannies Logo" style={{ height: "50px" }} />
      </div>

      {/* Name & Title */}
      <h2 style={{ textAlign: "center", margin: "20px 0 5px" }}>{formattedCV.header?.name}</h2>
      <h3 style={{ textAlign: "center", margin: "0", fontWeight: "normal" }}>
        {formattedCV.header?.title}
      </h3>

      {/* Photo */}
      <div style={{ textAlign: "center", margin: "15px 0" }}>
        <img
          src="https://via.placeholder.com/120x150.png?text=Profile+Photo"
          alt="Profile"
          style={{ width: "120px", height: "150px", objectFit: "cover", borderRadius: "4px" }}
        />
      </div>

      {/* Personal Info */}
      <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px" }}>
        <div>{formattedCV.personalInfo?.nationality}</div>
        <div>{formattedCV.personalInfo?.languages}</div>
        <div>{formattedCV.personalInfo?.dob}</div>
        <div>{formattedCV.personalInfo?.maritalStatus}</div>
        <div>{formattedCV.personalInfo?.otherDetails}</div>
      </div>

      {/* Profile */}
      <section style={{ marginBottom: "20px" }}>
        <h3>Profile</h3>
        <p style={{ textAlign: "justify" }}>{formattedCV.profile}</p>
      </section>

      {/* Experience */}
      {formattedCV.professional_experience?.map((exp, idx) => (
        <section key={idx} style={{ marginBottom: "15px" }}>
          <h3>{exp.dateRange} — {exp.company}</h3>
          <strong>{exp.position}</strong>
          <ul>
            {exp.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      ))}

      {/* Red Divider */}
      <div style={{
        background: "#800000",
        color: "#fff",
        padding: "8px",
        textAlign: "center",
        margin: "20px 0"
      }}>
        Exclusive Household Staff © Nannies | www.exclusivehouseholdstaff.com | +44 (0) 203 358 7000
      </div>

      {/* Education */}
      <section>
        <h3>Education</h3>
        
        {formattedCV.education && (
        <div>
        <strong>{formattedCV.education.degree}</strong> — {formattedCV.education.institution}, {formattedCV.education.date}
     </div>
        )}
      </section>

      {/* Skills */}
      <section>
        <h3>Key Skills</h3>
        <ul>
          {formattedCV.skills?.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>

      {/* Interests */}
      <section>
        <h3>Interests</h3>
        <ul>
          {formattedCV.interests && (
         <li>{formattedCV.interests}</li>
      )}

        </ul>
      </section>

      {/* Footer Divider */}
      <div style={{
        background: "#800000",
        color: "#fff",
        padding: "8px",
        textAlign: "center",
        marginTop: "20px"
      }}>
        Exclusive Household Staff © Nannies | www.exclusivehouseholdstaff.com | +44 (0) 203 358 7000
      </div>
    </div>
  );
}
