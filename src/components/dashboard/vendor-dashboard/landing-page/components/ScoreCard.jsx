import { FiTrendingUp, FiTrendingDown, FiRefreshCw } from "react-icons/fi";

const ScoreCard = ({ latest, history, formatDate }) => {
  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  // Calculate score trend
  const getScoreTrend = () => {
    if (history.length < 2) return 'stable';
    const scores = history.slice(-2).map(h => h.total_score);
    return scores[1] > scores[0] ? 'up' : scores[1] < scores[0] ? 'down' : 'stable';
  };

  const trend = getScoreTrend();

  return (
    <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
      <div className="d-flex justify-content-between align-items-center mb-30">
        <div>
          <h2 className="text-20 fw-600 text-gray-900 mb-2">Current Readiness Score</h2>
          <p className="text-gray-600">Your overall placement preparation level</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className={`trend-indicator ${trend}`}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: trend === 'up' ? '#d1fae5' : 
                       trend === 'down' ? '#fee2e2' : '#f1f5f9',
              color: trend === 'up' ? '#065f46' : 
                   trend === 'down' ? '#7f1d1d' : '#475569'
            }}
          >
            {trend === 'up' ? <FiTrendingUp /> : 
             trend === 'down' ? <FiTrendingDown /> : <FiRefreshCw />}
            {trend === 'up' ? 'Improving' : 
             trend === 'down' ? 'Declining' : 'Stable'}
          </div>
        </div>
      </div>

      {/* Score Circle */}
      <div className="text-center mb-40">
        <div className="position-relative d-inline-block">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke="#f1f5f9" 
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke={getScoreColor(latest.total_score)} 
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(latest.total_score / 100) * 565} 565`}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <div className="text-48 fw-700" style={{ color: getScoreColor(latest.total_score) }}>
              {latest.total_score}
            </div>
            <div className="text-14 text-gray-500">out of 100</div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="mb-40">
        <h3 className="text-18 fw-600 text-gray-900 mb-20">Score Distribution</h3>
        <div className="d-flex align-items-center gap-3">
          {[0, 25, 50, 75, 100].map((threshold, index) => (
            <div key={threshold} className="flex-fill">
              <div className="d-flex align-items-center mb-2">
                <div className="text-12 text-gray-600">{threshold}</div>
                {index < 4 && (
                  <div className="flex-fill ms-2">
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: '100%',
                          backgroundColor: threshold === 0 ? '#ef4444' : 
                                          threshold === 25 ? '#f59e0b' : 
                                          threshold === 50 ? '#eab308' : 
                                          threshold === 75 ? '#84cc16' : 
                                          '#10b981'
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-11 text-gray-500">
                {threshold === 0 ? 'Beginner' : 
                 threshold === 25 ? 'Basic' : 
                 threshold === 50 ? 'Intermediate' : 
                 threshold === 75 ? 'Advanced' : 
                 'Expert'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;