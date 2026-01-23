import { FiArrowUp, FiArrowDown, FiTrendingUp } from "react-icons/fi";
import { MdShowChart } from "react-icons/md";

const TrendsTab = ({ history, loading, formatDate }) => {
  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-gray-600 mt-3">Loading trends data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row y-gap-30 mt-30">
      <div className="col-12">
        <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <div>
              <h2 className="text-20 fw-600 text-gray-900 mb-2">Score Trends</h2>
              <p className="text-gray-600">Visual representation of your readiness progress</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <MdShowChart className="me-2" />
                Export Data
              </button>
            </div>
          </div>

          {history.length < 2 ? (
            <div className="text-center py-40">
              <div className="text-gray-400 mb-3">
                <MdShowChart size={48} />
              </div>
              <h3 className="text-18 fw-600 text-gray-700 mb-2">Insufficient Data</h3>
              <p className="text-gray-500">Complete at least 2 assessments to see trends.</p>
            </div>
          ) : (
            <>
              {/* Simple Trend Chart */}
              <div className="mb-40">
                <div className="trend-chart" style={{ height: '300px', position: 'relative' }}>
                  {/* X-axis */}
                  <div className="position-absolute bottom-0 start-0 end-0 border-top"></div>
                  {/* Y-axis */}
                  <div className="position-absolute top-0 bottom-0 start-0 border-end"></div>
                  
                  {/* Trend line */}
                  <div className="position-absolute top-0 bottom-0 start-0 end-0 p-4">
                    {history.map((record, index) => {
                      const x = (index / (history.length - 1)) * 100;
                      const y = 100 - record.total_score;
                      
                      return (
                        <div 
                          key={record.readiness_id}
                          className="position-absolute"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getScoreColor(record.total_score),
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="tooltip" style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#1f2937',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            opacity: '0',
                            transition: 'opacity 0.2s'
                          }}>
                            {formatDate(record.calculated_at)}: {record.total_score}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="row">
                <div className="col-md-4">
                  <div className="bg-light-blue-50 p-24 rounded-3 h-100">
                    <div className="text-primary mb-3">
                      <FiTrendingUp size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Average Score</h3>
                    <div className="text-32 fw-700 text-primary mb-2">
                      {Math.round(history.reduce((sum, record) => sum + record.total_score, 0) / history.length)}
                    </div>
                    <p className="text-13 text-gray-600">
                      Average score across all assessments
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light-green-50 p-24 rounded-3 h-100">
                    <div className="text-success mb-3">
                      <FiArrowUp size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Best Score</h3>
                    <div className="text-32 fw-700 text-success mb-2">
                      {Math.max(...history.map(h => h.total_score))}
                    </div>
                    <p className="text-13 text-gray-600">
                      Highest readiness score achieved
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bg-light-red-50 p-24 rounded-3 h-100">
                    <div className="text-danger mb-3">
                      <FiArrowDown size={28} />
                    </div>
                    <h3 className="text-18 fw-600 text-gray-900 mb-2">Worst Score</h3>
                    <div className="text-32 fw-700 text-danger mb-2">
                      {Math.min(...history.map(h => h.total_score))}
                    </div>
                    <p className="text-13 text-gray-600">
                      Lowest readiness score recorded
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendsTab;