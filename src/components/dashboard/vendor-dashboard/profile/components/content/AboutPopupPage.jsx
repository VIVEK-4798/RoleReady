import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AboutPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAITips, setShowAITips] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
      setShowAITips(false);
    }
  };

  useEffect(() => {
    if (showPopup || showAITips) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showAITips]);

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Section */}
      <div
        style={{
          borderRadius: "0.375rem",
          padding: "1rem",
          marginTop: "0.7rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h5
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              About
            </h5>
            <p
              style={{
                fontSize: "1rem",
                color: "#4B5563",
                marginBottom: "0.5rem",
              }}
            >
              Craft an engaging story in your bio and make meaningful
              connections with peers and recruiters alike!
            </p>
            <Link
              to="#"
              style={{ color: "#3B82F6", textDecoration: "underline" }}
              onClick={() => setShowPopup(true)}
            >
              Add About
            </Link>
          </div>
          <img
            src="/img/profile/about.webp"
            alt="about"
            style={{
              width: "140px",
              height: "110px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Main Popup */}
      {showPopup && (
        <div
          className="popup-main overlay"
          onClick={handleOverlayClick}
        >
          <div
            className="popup-second"
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              About Me <span style={{ color: "red" }}>*</span>
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
              Maximum 1000 characters can be added
            </p>
            <textarea
              placeholder="Introduce yourself here! Share a brief overview of who you are, your interests, and connect with fellow users, recruiters & organizers."
              maxLength={1000}
              className="profile-textarea"
            ></textarea>

            {/* AI Suggestion Button */}
            <button
              onClick={() => setShowAITips(true)}
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img
                src="/img/profile/tips.png"
                alt="AI"
                style={{
                  width: "20px",
                  height: "20px",
                  filter: "brightness(2) invert(1)"
                }}
              />
              Tips
            </button>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
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

      {/* AI Tips Modal */}
      {showAITips && (
        <div
          className="popup-main overlay"
          onClick={handleOverlayClick}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Tips for Writing a Great About Section
            </h4>
            <ul style={{ paddingLeft: "1rem", marginBottom: "1rem", color: "#374151" }}>
              <li>✔ Highlight your achievements</li>
              <li>✔ Mention your interests and passions</li>
              <li>✔ Add what tools/technologies you use</li>
              <li>✔ Keep it concise and genuine</li>
              <li>✔ Show your personality</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAITips(false)}
                style={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPopupPage;
