import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ExperiencePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [experience, setExperience] = useState({
    designation: "",
    organisation: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    location: "",
    skills: "",
    description: "",
  });

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

  const handleChange = (e) => {
    setExperience({ ...experience, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12" style={{ padding: "1rem", marginTop: "0.7rem" }}>
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-15">Work Experience</h5>
            <p className="text-16 text-light-1 mb-10">
              Narrate your professional journey to new career heights!
            </p>
            <Link to="#" className="text-blue-1" onClick={() => setShowPopup(true)}>
              Add Work Experience
            </Link>
          </div>
          <div>
            <img
              src="/img/profile/work_experience.webp"
              alt="work-experience"
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
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Work Experience
            </h3>

            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label>Designation *</label>
                <input
                    type="text"
                    name="designation"
                    value={experience.designation}
                    onChange={handleChange}
                    placeholder="Select Designation"
                    className="custom-input-style"
                    />
              </div>

              <div>
                <label>Organisation *</label>
                <input
                  type="text"
                  name="organisation"
                  value={experience.organisation}
                  onChange={handleChange}
                  placeholder="Select Organisation"
                  className="custom-input-style"
                />
              </div>

              <div>
                <label>Employment Type *</label>
                <select
                  name="employmentType"
                  value={experience.employmentType}
                  onChange={handleChange}
                  className="custom-input-style"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={experience.startDate}
                    onChange={handleChange}
                    className="!important custom-input-style"
                  />
                </div>

                <div>
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={experience.endDate}
                    onChange={handleChange}
                    className="custom-input-style"
                  />
                </div>
              </div>

              <div>
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={experience.location}
                  onChange={handleChange}
                  placeholder="Select Location"
                  className="custom-input-style"
                />
              </div>

              <div>
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={experience.skills}
                  onChange={handleChange}
                  placeholder="Add Skills"
                  className="custom-input-style"
                />
              </div>

              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={experience.description}
                  onChange={handleChange}
                  placeholder="Describe your responsibilities or achievements"
                  className="custom-input-style"
                  rows={4}
                />
              </div>
            </div>

            {/* Buttons */}
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

export default ExperiencePopupPage;
