import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFileAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";
import SkillSuggestionsReview from "./SkillSuggestionsReview";

/* ============================================================================
   📄 STEP 2 & 4: Resume Upload Component with Skill Suggestions
   ============================================================================
   
   Changes:
   - Now shows "Resume uploaded on [date]"
   - Uses new resumes table via updated endpoints
   - Displays file name and upload status
   - STEP 4: Integrated SkillSuggestionsReview component
   - STEP 5: Added recalculate readiness navigation
   ============================================================================ */

const ResumePopupPage = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeInfo, setResumeInfo] = useState({
    resume_name: "",
    uploaded_at: null,
    has_resume: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  // STEP 5: Handle recalculate readiness navigation
  const handleRecalculateReadiness = () => {
    navigate("/dashboard/readiness", { state: { recalculate: true } });
  };

  useEffect(() => {
    if (showPopup || showResumeTips) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showResumeTips]);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-resume/${user_id}`);
      setResumeInfo({
        resume_name: res.data.resume_name || "",
        uploaded_at: res.data.uploaded_at || null,
        has_resume: res.data.has_resume || false
      });
    } catch (err) {
      console.error("Error fetching resume:", err.message);
    }
  };

  // Format date for display
  const formatUploadDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
      setShowResumeTips(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };

  const handleSave = async () => {
    if (!resumeFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("resume", resumeFile);
    formData.append("role", "user"); 

    try {
      const res = await axios.post(`${api}/api/profile/upload-resume`, formData);
      if (res.data.success) {
        toast.success("Resume uploaded successfully");
        // Update resume info with response data
        setResumeInfo({
          resume_name: res.data.file_name || resumeFile.name,
          uploaded_at: res.data.uploaded_at || new Date().toISOString(),
          has_resume: true
        });
        setResumeFile(null);
        setShowPopup(false);
      } else {
        toast.error("Failed to upload resume");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsUploading(false);
    }
  };

  const openEditPopup = () => {
    setResumeFile(null); // Reset to allow new selection
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col" style={{ width: "80%" }}>
            <h5 className="text-20 fw-600 mb-15">Resume</h5>
            <p className="text-16 text-light-1 mb-10">
              Add your Resume & get your profile filled in a click!
            </p>
            
            {/* STEP 2: Show resume status with upload date */}
            {resumeInfo.has_resume ? (
              <div className="resume-status">
                {/* Success indicator */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  marginBottom: "0.5rem"
                }}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ color: "#10B981" }}
                  />
                  <span style={{ color: "#10B981", fontWeight: 500 }}>
                    Resume uploaded
                  </span>
                </div>
                
                {/* File name */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                  color: "#374151",
                  fontSize: "0.9rem"
                }}>
                  <FontAwesomeIcon icon={faFileAlt} style={{ color: "#6366f1" }} />
                  <span>{resumeInfo.resume_name}</span>
                </div>
                
                {/* Upload date */}
                {resumeInfo.uploaded_at && (
                  <p style={{ 
                    fontSize: "0.8rem", 
                    color: "#9CA3AF", 
                    marginBottom: "0.75rem",
                    marginLeft: "1.25rem"
                  }}>
                    Uploaded on {formatUploadDate(resumeInfo.uploaded_at)}
                  </p>
                )}
                
                {/* Edit button */}
                <button
                  onClick={openEditPopup}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.8rem",
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                >
                  <FontAwesomeIcon icon={faPenToSquare} size="sm" />
                  Replace Resume
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPopup(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#4338CA"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#4F46E5"}
              >
                <FontAwesomeIcon icon={faFileAlt} />
                Upload Resume
              </button>
            )}
          </div>
          <img
            src="/img/profile/resume.webp"
            alt="resume"
            style={{ width: 140, height: 110 }}
          />
        </div>
      </div>

      {/* STEP 4 & 5: Skill Suggestions Review with Readiness Recalculation */}
      {resumeInfo.has_resume && (
        <div style={{ marginTop: "1rem" }}>
          <SkillSuggestionsReview 
            onSkillsAdded={(count) => {
              // Toast handled in component now
            }}
            onRecalculateReadiness={handleRecalculateReadiness}
          />
        </div>
      )}

      {/* Upload Popup */}
      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {resumeInfo.has_resume ? "Replace Resume" : "Upload Resume"}
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
              Upload a one-pager that highlights your skills, experience, and accomplishments.
            </p>

            {/* Preview previously uploaded resume */}
            {resumeInfo.has_resume && !resumeFile && (
              <div style={{ 
                marginBottom: "1rem", 
                padding: "0.75rem",
                backgroundColor: "#f9fafb",
                borderRadius: "0.375rem",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#374151", fontSize: "0.875rem" }}>
                  <FontAwesomeIcon icon={faFileAlt} style={{ color: "#6366f1" }} />
                  <strong>Current:</strong> {resumeInfo.resume_name}
                </div>
                {resumeInfo.uploaded_at && (
                  <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.25rem", marginLeft: "1.25rem" }}>
                    Uploaded {formatUploadDate(resumeInfo.uploaded_at)}
                  </p>
                )}
              </div>
            )}

            {/* New file input */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ 
                display: "block", 
                fontSize: "0.8rem", 
                color: "#374151", 
                marginBottom: "0.5rem",
                fontWeight: 500
              }}>
                {resumeInfo.has_resume ? "Select new resume file:" : "Select resume file:"}
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange}
                style={{ fontSize: "0.875rem" }}
              />
              {resumeFile && (
                <p style={{ fontSize: "0.8rem", color: "#10B981", marginTop: "0.5rem" }}>
                  ✓ Selected: {resumeFile.name}
                </p>
              )}
            </div>

            {/* Resume Tips Button */}
            <button
              onClick={() => setShowResumeTips(true)}
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
                alt="Resume Tips"
                style={{ width: "20px", height: "20px", filter: "brightness(2) invert(1)" }}
              />
              Resume Tips
            </button>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", gap: "0.75rem" }}>
              <button 
                onClick={() => setShowPopup(false)} 
                className="cancel-button"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="save-button"
                disabled={isUploading || !resumeFile}
                style={{
                  opacity: (isUploading || !resumeFile) ? 0.6 : 1,
                  cursor: (isUploading || !resumeFile) ? 'not-allowed' : 'pointer'
                }}
              >
                {isUploading ? "Uploading..." : (resumeInfo.has_resume ? "Replace" : "Upload")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Tips Modal */}
      {showResumeTips && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}>
            <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Tips for Uploading a Great Resume
            </h4>
            <ul style={{ paddingLeft: "1rem", marginBottom: "1rem", color: "#374151" }}>
              <li>✔ Keep it to 1-2 pages</li>
              <li>✔ Highlight achievements, not just responsibilities</li>
              <li>✔ Use clear formatting</li>
              <li>✔ Save as PDF for better compatibility</li>
              <li>✔ Tailor it to the job you’re applying for</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowResumeTips(false)}
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

export default ResumePopupPage;
