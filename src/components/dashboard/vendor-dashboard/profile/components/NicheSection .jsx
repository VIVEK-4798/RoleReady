import React, { useState } from 'react';

const NicheSection = () => {
  const [showNiche, setShowNiche] = useState(true);

  return (
    <>
      {showNiche && (
        <div className="bg-white shadow rounded p-3 mb-30">
          <h5 className="text-20 fw-600 mb-15">What’s your niche?</h5>
          <p className="text-16 text-light-1 mb-10">Tell us your interest so we can help you grow!</p>
          <select className="form-select mb-10">
            <option>Select Your Domain</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full Stack</option>
          </select>
          <div className="d-flex justify-between">
            <button className="button -red-1 p-1" onClick={() => setShowNiche(false)}>
              Cancel
            </button>
            <button className="button -blue-1 p-1">Next</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NicheSection;
