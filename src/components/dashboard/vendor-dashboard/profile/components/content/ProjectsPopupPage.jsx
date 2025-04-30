import React, { useState, useEffect } from "react";

const ProjectsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    link: "",
    skills: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Data Submitted:", projectData);
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
            <h5 className="text-20 fw-600 mb-12">Projects</h5>
            <p className="text-16 text-light-1 mb-10">
              Unveil your projects to the world and pave your path to professional greatness!
            </p>
            <span
              className="text-blue-1 cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              Add Projects
            </span>
          </div>
          <div>
            <img
              src="/img/profile/projects.webp"
              alt="projects"
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
            <h3 className="text-lg font-semibold mb-4">Projects</h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm">Title of Project</label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Project Link</label>
                <input
                  type="url"
                  name="link"
                  value={projectData.link}
                  onChange={handleChange}
                  placeholder="https://your-project-link.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={projectData.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  placeholder="Describe your project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="4"
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

export default ProjectsPopupPage;
