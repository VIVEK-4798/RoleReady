import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ResumePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Section */}
      <div className="rounded p-3 ">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-15">Resume</h5>
            <p className="text-16 text-light-1 mb-10">
              Add your Resume & get your profile filled in a click!
            </p>
            <Link
              to="#"
              className="text-blue-1"
              style={{ textDecoration: "underline" }}
              onClick={() => setShowPopup(true)}
            >
              Upload Resume
            </Link>
          </div>
          <div>
            <img
              src="/img/profile/resume.webp"
              alt="resume"
              style={{ width: 140, height: 110 }}
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="overlay"
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              width: "100%",
              maxWidth: "640px",
              padding: "1.5rem",
              position: "relative",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Resume <span style={{ color: "red" }}>*</span>
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                marginBottom: "1rem",
              }}
            >
              Remember that one pager that highlights how amazing you are? Time
              to let employers notice your potential through it.
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  backgroundColor: "#D1D5DB",
                  color: "#1F2937",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  marginLeft: "0.5rem",
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePopupPage;
