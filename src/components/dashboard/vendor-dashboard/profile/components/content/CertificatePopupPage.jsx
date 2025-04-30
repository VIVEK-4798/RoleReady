import React, { useState, useEffect } from "react";

const CertificatePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [certificate, setCertificate] = useState({
    title: "",
    organization: "",
    issuedDate: "",
    expiryDate: "",
    linked: false,
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Certificate data:", certificate);
    setShowPopup(false);
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showPopup]);

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Section */}
      <div className="rounded p-3 mb-12">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-12">Certificates</h5>
            <p className="text-16 text-light-1 mb-10">
              Highlight your professional certifications and achievements to stand out from the crowd!
            </p>
            <span
              className="text-blue-1 cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              Add Certificate
            </span>
          </div>
          <div>
            <img
              src="/img/profile/certificate.webp"
              alt="certificate"
              style={{ width: 140, height: 110 }}
            />
          </div>
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
            <h3 className="text-lg font-semibold mb-2">
              Certificates <span style={{ color: "red" }}>*</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm">Title of Certificate *</label>
                <input
                  type="text"
                  name="title"
                  value={certificate.title}
                  onChange={handleChange}
                  placeholder="Title of Certificate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Issuing Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={certificate.organization}
                  onChange={handleChange}
                  placeholder="Organisation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Issued Date *</label>
                <input
                  type="date"
                  name="issuedDate"
                  value={certificate.issuedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={certificate.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={certificate.description}
                  onChange={handleChange}
                  placeholder="Describe your certificate or achievement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  rows="3"
                ></textarea>
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
          </form>
        </div>
      )}
    </div>
  );
};

export default CertificatePopupPage;
