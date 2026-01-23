import { FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { MdInsights } from "react-icons/md";

const ProgressAnalysis = ({ progress }) => {
  return (
    <div className="col-12">
      <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
        <div className="d-flex align-items-center justify-content-between mb-24">
          <h2 className="text-20 fw-600 text-gray-900 mb-0">Progress Analysis</h2>
          <div className="d-flex align-items-center gap-2 text-14 text-gray-600">
            <FiRefreshCw size={16} />
            Updated in real-time
          </div>
        </div>

        {progress.newly_met_skills.length === 0 && 
         progress.newly_missing_skills.length === 0 ? (
          <div className="text-center py-30">
            <div className="text-gray-400 mb-3">
              <FiCheckCircle size={48} />
            </div>
            <h3 className="text-18 fw-600 text-gray-700 mb-2">No Significant Changes</h3>
            <p className="text-gray-500">Your skill profile has remained stable since last assessment.</p>
          </div>
        ) : (
          <div className="row">
            {/* Improved Skills */}
            {progress.newly_met_skills.length > 0 && (
              <div className="col-md-6 mb-20">
                <div className="bg-success-50 rounded-3 p-24 h-100 border border-success-100">
                  <div className="d-flex align-items-center gap-3 mb-16">
                    <div className="bg-success p-8 rounded-circle">
                      <FiCheckCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-18 fw-600 text-success-800 mb-0">Improved Skills</h3>
                      <p className="text-13 text-success-600 mb-0">Skills that increased your score</p>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {progress.newly_met_skills.map(skill => (
                      <span 
                        key={skill} 
                        className="badge bg-success text-white py-2 px-3 rounded-pill d-flex align-items-center gap-2"
                      >
                        <FiCheckCircle size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skills to Improve */}
            {progress.newly_missing_skills.length > 0 && (
              <div className="col-md-6 mb-20">
                <div className="bg-warning-50 rounded-3 p-24 h-100 border border-warning-100">
                  <div className="d-flex align-items-center gap-3 mb-16">
                    <div className="bg-warning p-8 rounded-circle">
                      <FiXCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-18 fw-600 text-warning-800 mb-0">Focus Areas</h3>
                      <p className="text-13 text-warning-600 mb-0">Skills that need improvement</p>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {progress.newly_missing_skills.map(skill => (
                      <span 
                        key={skill} 
                        className="badge bg-warning text-dark py-2 px-3 rounded-pill d-flex align-items-center gap-2"
                      >
                        <FiXCircle size={14} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-30 pt-24 border-top">
          <h3 className="text-18 fw-600 text-gray-900 mb-16">Recommendations</h3>
          <div className="row">
            <div className="col-md-4">
              <div className="bg-light-blue-50 p-20 rounded-3 h-100">
                <div className="text-primary mb-2">
                  <MdInsights size={24} />
                </div>
                <h4 className="text-16 fw-600 text-gray-900 mb-2">Regular Assessment</h4>
                <p className="text-13 text-gray-600">
                  Update your skills weekly to track accurate progress
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light-green-50 p-20 rounded-3 h-100">
                <div className="text-success mb-2">
                  <FiCheckCircle size={24} />
                </div>
                <h4 className="text-16 fw-600 text-gray-900 mb-2">Focus on Weak Areas</h4>
                <p className="text-13 text-gray-600">
                  Prioritize skills marked as "Focus Areas" for maximum impact
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light-purple-50 p-20 rounded-3 h-100">
                <div className="text-purple mb-2">
                  <FiCheckCircle size={24} />
                </div>
                <h4 className="text-16 fw-600 text-gray-900 mb-2">Consistent Practice</h4>
                <p className="text-13 text-gray-600">
                  Daily practice sessions lead to steady score improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalysis;