import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileAlt, 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle,
  faLightbulb,
  faChevronDown,
  faChevronUp,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";

/* ============================================================================
   📄 STEP 4: Skill Suggestions Review Component
   ============================================================================
   
   This component displays skills extracted from the user's resume and lets
   them explicitly choose which ones to add to their profile.
   
   KEY PRINCIPLES:
   - "User is in control, system assists"
   - All checkboxes default to UNCHECKED
   - User must explicitly select skills to add
   - Clear visual feedback on actions
   ============================================================================ */

const SkillSuggestionsReview = ({ onSkillsAdded, onRecalculateReadiness }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [parserStatus, setParserStatus] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // STEP 5: Prompt for recalculating readiness after adding skills
  const [showRecalculatePrompt, setShowRecalculatePrompt] = useState(false);
  const [addedSkillsCount, setAddedSkillsCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  // Fetch status and suggestions on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${api}/api/resume-parser/status/${user_id}`);
      setParserStatus(res.data);
      
      if (res.data.is_parsed && res.data.pending_suggestions > 0) {
        fetchSuggestions();
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching parser status:", err);
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `${api}/api/resume-parser/suggestions/${user_id}?status=pending`
      );
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse resume to extract skills
  const handleParseResume = async () => {
    setIsParsing(true);
    try {
      const res = await axios.post(`${api}/api/resume-parser/parse`, {
        user_id
      });
      
      if (res.data.success) {
        toast.success(`Found ${res.data.new_suggestions} new skills in your resume!`);
        setSuggestions(res.data.suggestions || []);
        setParserStatus({
          ...parserStatus,
          is_parsed: true,
          pending_suggestions: res.data.new_suggestions
        });
      } else {
        toast.error("Failed to parse resume");
      }
    } catch (err) {
      console.error("Error parsing resume:", err);
      toast.error(err.response?.data?.message || "Failed to parse resume");
    } finally {
      setIsParsing(false);
    }
  };

  // Toggle skill selection
  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  };

  // Select all skills
  const selectAll = () => {
    setSelectedSkills(new Set(suggestions.map(s => s.skill_id)));
  };

  // Deselect all skills
  const deselectAll = () => {
    setSelectedSkills(new Set());
  };

  // Confirm selected skills
  const handleConfirm = async () => {
    if (selectedSkills.size === 0) {
      toast.warning("Please select at least one skill to add");
      return;
    }

    setIsConfirming(true);
    try {
      const acceptedIds = Array.from(selectedSkills);
      const rejectedIds = suggestions
        .filter(s => !selectedSkills.has(s.skill_id))
        .map(s => s.skill_id);

      const res = await axios.post(`${api}/api/resume-parser/confirm`, {
        user_id,
        accepted_skill_ids: acceptedIds,
        rejected_skill_ids: rejectedIds
      });

      if (res.data.success) {
        toast.success(`Added ${res.data.accepted_count} skills from your resume!`);
        setSuggestions([]);
        setSelectedSkills(new Set());
        setParserStatus({
          ...parserStatus,
          pending_suggestions: 0
        });
        
        // STEP 5: Show recalculate readiness prompt
        // Do NOT auto-recalculate - user must explicitly choose
        setAddedSkillsCount(res.data.accepted_count);
        setShowRecalculatePrompt(true);
        
        // Notify parent component
        if (onSkillsAdded) {
          onSkillsAdded(res.data.accepted_count);
        }
      }
    } catch (err) {
      console.error("Error confirming skills:", err);
      toast.error("Failed to add skills");
    } finally {
      setIsConfirming(false);
    }
  };

  // Skip all suggestions
  const handleSkipAll = async () => {
    setIsConfirming(true);
    try {
      const res = await axios.post(`${api}/api/resume-parser/reject-all`, {
        user_id
      });

      if (res.data.success) {
        toast.info("Skipped all resume skill suggestions");
        setSuggestions([]);
        setSelectedSkills(new Set());
        setParserStatus({
          ...parserStatus,
          pending_suggestions: 0
        });
      }
    } catch (err) {
      console.error("Error rejecting skills:", err);
      toast.error("Failed to skip suggestions");
    } finally {
      setIsConfirming(false);
    }
  };

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category_name || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(suggestion);
    return acc;
  }, {});

  // Don't show if no resume
  if (!parserStatus?.has_resume) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="skill-suggestions skill-suggestions--loading">
        <FontAwesomeIcon icon={faSpinner} spin /> Loading...
      </div>
    );
  }

  // Resume not parsed yet - show parse button
  if (!parserStatus?.is_parsed) {
    return (
      <div className="skill-suggestions">
        <div className="skill-suggestions__header">
          <div className="skill-suggestions__icon">
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <div>
            <h4 className="skill-suggestions__title">Extract Skills from Resume</h4>
            <p className="skill-suggestions__subtitle">
              We can scan your resume to find skills and suggest them for your profile.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleParseResume}
          disabled={isParsing}
          className="skill-suggestions__parse-btn"
        >
          {isParsing ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Analyzing Resume...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faFileAlt} /> Scan Resume for Skills
            </>
          )}
        </button>
      </div>
    );
  }

  // STEP 5: Handle recalculate readiness action
  const handleRecalculateReadiness = () => {
    setShowRecalculatePrompt(false);
    if (onRecalculateReadiness) {
      onRecalculateReadiness();
    }
  };

  const handleSkipRecalculate = () => {
    setShowRecalculatePrompt(false);
    toast.info("You can recalculate readiness anytime from the Readiness page.");
  };

  // STEP 5: Show recalculate readiness prompt after adding skills
  if (showRecalculatePrompt) {
    return (
      <div className="skill-suggestions skill-suggestions--prompt">
        <div className="skill-suggestions__prompt-content">
          <div className="skill-suggestions__prompt-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="skill-suggestions__prompt-text">
            <h4 className="skill-suggestions__prompt-title">
              {addedSkillsCount} New Skill{addedSkillsCount !== 1 ? 's' : ''} Added!
            </h4>
            <p className="skill-suggestions__prompt-subtitle">
              Recalculate your readiness score to see how these skills affect your profile?
            </p>
          </div>
        </div>
        <div className="skill-suggestions__prompt-actions">
          <button
            onClick={handleSkipRecalculate}
            className="skill-suggestions__prompt-skip-btn"
          >
            Not Now
          </button>
          <button
            onClick={handleRecalculateReadiness}
            className="skill-suggestions__prompt-recalc-btn"
          >
            <FontAwesomeIcon icon={faSync} /> Recalculate Readiness
          </button>
        </div>
      </div>
    );
  }

  // No pending suggestions
  if (suggestions.length === 0) {
    return (
      <div className="skill-suggestions skill-suggestions--empty">
        <FontAwesomeIcon icon={faCheckCircle} className="skill-suggestions__done-icon" />
        <span>All resume skills reviewed!</span>
        <button
          onClick={handleParseResume}
          disabled={isParsing}
          className="skill-suggestions__rescan-btn"
        >
          {isParsing ? "Scanning..." : "Rescan Resume"}
        </button>
      </div>
    );
  }

  // Main review UI
  return (
    <div className="skill-suggestions">
      {/* Header with toggle */}
      <div 
        className="skill-suggestions__header skill-suggestions__header--clickable"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="skill-suggestions__icon skill-suggestions__icon--pending">
          <FontAwesomeIcon icon={faLightbulb} />
        </div>
        <div className="skill-suggestions__header-content">
          <h4 className="skill-suggestions__title">
            Skills Found in Your Resume
            <span className="skill-suggestions__count">{suggestions.length}</span>
          </h4>
          <p className="skill-suggestions__subtitle">
            Select the skills you want to add to your profile
          </p>
        </div>
        <FontAwesomeIcon 
          icon={isExpanded ? faChevronUp : faChevronDown} 
          className="skill-suggestions__toggle"
        />
      </div>

      {isExpanded && (
        <>
          {/* Selection controls */}
          <div className="skill-suggestions__controls">
            <button onClick={selectAll} className="skill-suggestions__control-btn">
              Select All
            </button>
            <button onClick={deselectAll} className="skill-suggestions__control-btn">
              Deselect All
            </button>
            <span className="skill-suggestions__selected-count">
              {selectedSkills.size} of {suggestions.length} selected
            </span>
          </div>

          {/* Skills list grouped by category */}
          <div className="skill-suggestions__list">
            {Object.entries(groupedSuggestions).map(([category, skills]) => (
              <div key={category} className="skill-suggestions__category">
                <h5 className="skill-suggestions__category-name">{category}</h5>
                <div className="skill-suggestions__skills">
                  {skills.map((suggestion) => (
                    <label
                      key={suggestion.skill_id}
                      className={`skill-suggestions__skill ${
                        selectedSkills.has(suggestion.skill_id) 
                          ? "skill-suggestions__skill--selected" 
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.has(suggestion.skill_id)}
                        onChange={() => toggleSkill(suggestion.skill_id)}
                        className="skill-suggestions__checkbox"
                      />
                      <span className="skill-suggestions__skill-name">
                        {suggestion.skill_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="skill-suggestions__actions">
            <button
              onClick={handleSkipAll}
              disabled={isConfirming}
              className="skill-suggestions__skip-btn"
            >
              <FontAwesomeIcon icon={faTimesCircle} /> Skip All
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming || selectedSkills.size === 0}
              className="skill-suggestions__confirm-btn"
            >
              {isConfirming ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Adding...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} /> 
                  Add {selectedSkills.size} Skill{selectedSkills.size !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>

          {/* Trust message */}
          <p className="skill-suggestions__trust-message">
            🛡️ Only skills you select will be added. You're in control.
          </p>
        </>
      )}
    </div>
  );
};

export default SkillSuggestionsReview;
