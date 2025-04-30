import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SkillsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const suggestions = [
    "TensorFlow Serving",
    "M&A Analysis",
    "Manufacturing",
    "Performance Management",
    "Resourcefulness",
    "IAM",
    "Portfolio Development",
    "UpKeep",
    "Environmental Regulations",
    "Wireshark",
  ];

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div
        className="rounded p-3 mb-12"
        style={{ padding: "1rem", marginTop: "0.7rem" }}
      >
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-15">Skills</h5>
            <p className="text-16 text-light-1 mb-10">
              Spotlight your unique skills for recruiters!
            </p>
            <Link
              to="#"
              className="text-blue-1"
              onClick={() => setShowPopup(true)}
            >
              Add Skills
            </Link>
          </div>
          <div>
            <img
              src="/img/profile/skills.webp"
              alt="skills"
              style={{ width: 140, height: 110 }}
            />
          </div>
        </div>
      </div>

      {showPopup && (
        <div
        className="popup-main overlay"
        onClick={handleOverlayClick}
        >
          <div
            className="popup-second"
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Skills <span style={{ color: "red" }}>*</span>
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                marginBottom: "1rem",
              }}
            >
              List your skills here, showcasing what you excel at.
            </p>
            <textarea
              placeholder="List your skills here, showcasing what you excel at."
              style={{
                width: "100%",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                padding: "0.75rem",
                minHeight: "120px",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
              value={selectedSkills.join(", ")}
              readOnly
            />

            {/* Suggestions Section */}
            <div>
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                Suggestions
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {suggestions.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "1rem",
                      backgroundColor: selectedSkills.includes(skill)
                        ? "#2563EB"
                        : "#F3F4F6",
                      color: selectedSkills.includes(skill)
                        ? "#ffffff"
                        : "#1F2937",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                className="save-button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPopupPage;
