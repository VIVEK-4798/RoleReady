import { useEffect, useState, useRef } from "react";

const API_BASE = "http://localhost:5000/api";
const DEMO_USER_ID = 25;

const DemoModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [missingRequiredSkills, setMissingRequiredSkills] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const modalRef = useRef();

  /* ---------------- Handle outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/categories/get-categories`)
      .then(res => res.json())
      .then(data => setCategories(data.results))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ---------------- Category change ---------------- */
  const handleCategoryChange = async (categoryId) => {
    const selectedCategory = categories.find(cat => cat.category_id == categoryId);
    setCategoryName(selectedCategory?.category_name || "");
    setSelectedCategoryId(categoryId);
    setSelectedSkillIds([]);
    setSkills([]);
    setShowResult(false);
    setProgress(null);

    if (!categoryId) return;

    try {
      const res = await fetch(
        `${API_BASE}/categories/get-skills-by-category/${categoryId}`
      );
      const data = await res.json();
      setSkills(data.results);
    } catch {
      setError("Failed to load skills");
    }
  };

  /* ---------------- Skill toggle ---------------- */
  const toggleSkill = (skillId) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  /* ---------------- Reset to category selection ---------------- */
  const handleReset = () => {
    setShowResult(false);
    setSelectedSkillIds([]);
    setProgress(null);
    setScore(null);
    setBreakdown([]);
    setMissingRequiredSkills([]);
  };

  /* ---------------- Analyze readiness ---------------- */
  const handleAnalyze = async () => {
    if (!selectedCategoryId || selectedSkillIds.length === 0) return;

    setLoading(true);
    setError("");
    setProgress(null);

    try {
      /* 1️⃣ Save demo skills */
      const saveRes = await fetch(`${API_BASE}/readiness/user-skills/bulk-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: DEMO_USER_ID,
          skill_ids: selectedSkillIds,
          mode: "demo",
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save skills");

      /* 2️⃣ Calculate readiness */
      const res = await fetch(`${API_BASE}/readiness/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: DEMO_USER_ID,
          category_id: selectedCategoryId,
        }),
      });

      if (!res.ok) throw new Error("Failed to calculate score");

      const data = await res.json();
      setScore(data.total_score);

      /* 3️⃣ Fetch breakdown + roadmap stub */
      const breakdownRes = await fetch(
        `${API_BASE}/readiness/breakdown/${data.readiness_id}`
      );

      if (!breakdownRes.ok) throw new Error("Failed to load breakdown");

      const breakdownData = await breakdownRes.json();
      setBreakdown(breakdownData.breakdown);
      setMissingRequiredSkills(breakdownData.missing_required_skills || []);

      /* 4️⃣ Fetch progress data */
      try {
        const progressRes = await fetch(
          `${API_BASE}/readiness/progress/${DEMO_USER_ID}/${selectedCategoryId}`
        );

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData);
        }
      } catch (progressErr) {
        console.log("Progress fetch failed (optional):", progressErr);
      }

      setShowResult(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzeDisabled =
    !selectedCategoryId || selectedSkillIds.length === 0 || loading;

  /* ---------------- UI ---------------- */
  return (
    <div className="demo-modal-overlay">
      <div className="demo-modal-container" ref={modalRef}>
        <button onClick={onClose} className="demo-modal-close">✕</button>

        {!showResult ? (
          <div className="demo-modal-content-initial">
            <div className="demo-modal-header-initial">
              <h3 className="demo-modal-title">Quick Readiness Demo</h3>
              <p className="demo-modal-subtitle">
                Select your target role and skills to see your readiness score
              </p>
            </div>

            {/* Category Selection */}
            <div className="demo-modal-section-initial">
              <label className="demo-modal-label">
                Target Role Category
              </label>
              <select
                className="demo-modal-select"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Selection - Only show if category is selected */}
            {selectedCategoryId && (
              <div className="demo-modal-section-initial">
                <div className="demo-modal-skills-header">
                  <label className="demo-modal-label">Skills You Have</label>
                  <span className="demo-modal-skills-count">
                    {selectedSkillIds.length} selected
                  </span>
                </div>
                
                {skills.length > 0 ? (
                  <div className="demo-modal-skills-wrapper">
                    <div className="demo-modal-skills-grid">
                      {skills.map(skill => (
                        <button
                          key={skill.skill_id}
                          type="button"
                          onClick={() => toggleSkill(skill.skill_id)}
                          className={`demo-modal-skill-button ${
                            selectedSkillIds.includes(skill.skill_id)
                              ? "selected"
                              : ""
                          }`}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="demo-modal-loading-skills">
                    Loading skills...
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="demo-modal-error-initial">
                <span className="demo-modal-error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="demo-modal-actions-initial">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled}
                className="demo-modal-primary-button"
              >
                {loading ? (
                  <>
                    <span className="demo-modal-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Readiness"
                )}
              </button>
              <p className="demo-modal-hint">
                Select at least one skill to analyze your readiness
              </p>
            </div>
          </div>
        ) : (
          <div className="demo-modal-content">
            <div className="demo-modal-header">
              <h3 className="demo-modal-title">Demo Result</h3>
              <p className="demo-modal-category">{categoryName}</p>
            </div>

            {/* Main Score Card */}
            <div className="demo-modal-score-card">
              <div className="demo-modal-score-main">
                <span className="demo-modal-score-label">Readiness Score</span>
                <div className="demo-modal-score-value">{score}<span>/100</span></div>
              </div>
              
              {/* Progress Display */}
              {progress && (
                <div className="demo-modal-progress-card">
                  <h4 className="demo-modal-progress-title">
                    Progress Since Last Check
                  </h4>
                  
                  <div className="demo-modal-progress-delta">
                    {progress.score_delta > 0 && (
                      <span className="delta-positive">⬆ Improved by {progress.score_delta} points</span>
                    )}
                    {progress.score_delta < 0 && (
                      <span className="delta-negative">⬇ Dropped by {Math.abs(progress.score_delta)} points</span>
                    )}
                    {progress.score_delta === 0 && (
                      <span className="delta-neutral">No score change</span>
                    )}
                  </div>

                  {progress.newly_met_skills && progress.newly_met_skills.length > 0 && (
                    <div className="demo-modal-new-skills">
                      <p className="demo-modal-progress-subtitle">
                        <strong>Newly Improved Skills:</strong>
                      </p>
                      <div className="demo-modal-skills-tags">
                        {progress.newly_met_skills.map(skill => (
                          <span key={skill} className="demo-modal-new-skill-tag">
                            ✅ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Skill Gap Breakdown */}
            <div className="demo-modal-section">
              <h4 className="demo-modal-section-title">
                Skill Gap Breakdown
              </h4>
              <div className="demo-modal-breakdown-grid">
                {breakdown.map(item => (
                  <div
                    key={item.skill}
                    className={`demo-modal-breakdown-item ${
                      item.status === "met" ? "met" : "missing"
                    }`}
                  >
                    <span className="demo-modal-breakdown-skill">{item.skill}</span>
                    <span className={`demo-modal-breakdown-status ${
                      item.status === "met" ? "status-met" : "status-missing"
                    }`}>
                      {item.status === "met" ? "✅ Met" : "❌ Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What to focus on next */}
            {missingRequiredSkills.length > 0 && (
              <div className="demo-modal-focus-section">
                <h4 className="demo-modal-focus-title">
                  What to focus on next
                </h4>
                <div className="demo-modal-focus-list">
                  {missingRequiredSkills.map(skill => (
                    <div key={skill} className="demo-modal-focus-item">
                      <span className="demo-modal-focus-icon">✅</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
                <p className="demo-modal-focus-text">
                  These skills should be prioritized to improve your readiness.
                </p>
              </div>
            )}

            <div className="demo-modal-actions">
              <button onClick={handleReset} className="demo-modal-secondary-button">
                Try Another Analysis
              </button>
              <button onClick={onClose} className="demo-modal-close-button">
                Close Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModal;