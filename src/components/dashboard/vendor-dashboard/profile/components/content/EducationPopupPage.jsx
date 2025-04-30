import React, { useState, useEffect } from "react";

const EducationPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [education, setEducation] = useState({
    qualification: "",
    course: "",
    specialization: "",
    college: "",
    startYear: "",
    endYear: "",
    courseType: "",
    percentage: "",
    cgpa: "",
    rollNumber: "",
    lateralEntry: false,
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Education data:", education);
    setShowPopup(false);
  };

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

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Section trigger */}
      <div style={{ borderRadius: "0.375rem", padding: "1rem", marginTop: "0.7rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h5 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Education
            </h5>
            <p style={{ fontSize: "1rem", color: "#4B5563", marginBottom: "0.5rem" }}>
              Add your educational background here
            </p>
            <span
              style={{ color: "#3B82F6", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => setShowPopup(true)}
            >
              Add Education
            </span>
          </div>
          <img
            src="/img/profile/education.webp"
            alt="education"
            style={{ width: "140px", height: "110px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="popup-main overlay"
          onClick={handleOverlayClick}
        >
          <form
            onSubmit={handleSubmit}
            className="popup-second"
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
              Add Education <span style={{ color: "red" }}>*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Qualification *", name: "qualification", placeholder: "Enter qualification" },
                { label: "Course *", name: "course", placeholder: "Enter course" },
                { label: "Specialization *", name: "specialization", placeholder: "Enter specialization" },
                { label: "College *", name: "college", placeholder: "Enter college" },
                { label: "Start Year *", name: "startYear", type: "month" },
                { label: "End Year *", name: "endYear", type: "month" },
                { label: "CGPA", name: "cgpa", placeholder: "Enter CGPA" },
              ].map(({ label, name, type = "text", placeholder = "" }) => (
                <div key={name}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={education[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mb-1"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={education.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={education.description}
                  onChange={handleChange}
                  placeholder="Describe your academic experience"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mt-1"
                ></textarea>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EducationPopupPage;
