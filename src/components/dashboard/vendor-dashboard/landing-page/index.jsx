import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import { FiTrendingUp, FiTrendingDown, FiRefreshCw, FiCalendar, FiCheckCircle, FiXCircle, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { MdInsights, MdShowChart, MdHistory, MdTimeline } from "react-icons/md";

const API_BASE = "http://localhost:5000/api";
const USER_ID = 25;        // replace later with auth
const CATEGORY_ID = 17;   // Frontend Developer Intern

const Index = () => {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, historyRes, progressRes] = await Promise.all([
          fetch(`${API_BASE}/readiness/latest/${USER_ID}/${CATEGORY_ID}`),
          fetch(`${API_BASE}/readiness/history/${USER_ID}/${CATEGORY_ID}`),
          fetch(`${API_BASE}/readiness/progress/${USER_ID}/${CATEGORY_ID}`),
        ]);

        if (latestRes.ok) setLatest(await latestRes.json());
        if (historyRes.ok) setHistory(await historyRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const previousScore = history.length > 1 ? history[history.length - 2]?.total_score : null;
  const scoreDelta = progress?.score_delta || 0;

  // Calculate score trend
  const getScoreTrend = () => {
    if (history.length < 2) return 'stable';
    const scores = history.slice(-2).map(h => h.total_score);
    return scores[1] > scores[0] ? 'up' : scores[1] < scores[0] ? 'down' : 'stable';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <>
      <div className="header-margin"></div>
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2" style={{ background: '#f8fafc' }}>
            {/* Page Header */}
            <div className="row y-gap-30 pt-30">
              <div className="col-12">
                <div className="py-30 px-30 rounded-4 bg-white shadow-sm border border-gray-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h1 className="text-28 fw-700 mb-5" style={{ color: '#0f172a' }}>
                        Readiness Dashboard
                      </h1>
                      <p className="text-16 text-gray-600 mb-0">
                        Track and improve your placement preparation progress
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-14 text-gray-500">Updated:</span>
                      <span className="text-14 fw-500 text-gray-700">
                        {latest ? formatDate(latest.calculated_at) : '--'}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="d-flex gap-3 mt-30 border-bottom pb-2">
                    <button
                      className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'none',
                        color: activeTab === 'overview' ? '#5693C1' : '#64748b',
                        fontWeight: '600',
                        fontSize: '14px',
                        borderBottom: activeTab === 'overview' ? '2px solid #5693C1' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MdInsights className="me-2" size={18} />
                      Overview
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveTab('history')}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'none',
                        color: activeTab === 'history' ? '#5693C1' : '#64748b',
                        fontWeight: '600',
                        fontSize: '14px',
                        borderBottom: activeTab === 'history' ? '2px solid #5693C1' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MdHistory className="me-2" size={18} />
                      History
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                      onClick={() => setActiveTab('trends')}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'none',
                        color: activeTab === 'trends' ? '#5693C1' : '#64748b',
                        fontWeight: '600',
                        fontSize: '14px',
                        borderBottom: activeTab === 'trends' ? '2px solid #5693C1' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MdShowChart className="me-2" size={18} />
                      Trends
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="row y-gap-30 mt-30">
                {/* Main Score Card */}
                <div className="col-lg-8">
                  <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
                    {loading ? (
                      <div className="text-center py-40">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-gray-600 mt-3">Loading readiness data...</p>
                      </div>
                    ) : !latest ? (
                      <div className="text-center py-40">
                        <div className="text-gray-400 mb-3">
                          <MdTimeline size={48} />
                        </div>
                        <h3 className="text-20 fw-600 text-gray-700 mb-2">No Readiness Data</h3>
                        <p className="text-gray-500">Complete your first readiness assessment to see your progress.</p>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-30">
                          <div>
                            <h2 className="text-20 fw-600 text-gray-900 mb-2">Current Readiness Score</h2>
                            <p className="text-gray-600">Your overall placement preparation level</p>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className={`trend-indicator ${getScoreTrend()}`}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: getScoreTrend() === 'up' ? '#d1fae5' : 
                                         getScoreTrend() === 'down' ? '#fee2e2' : '#f1f5f9',
                                color: getScoreTrend() === 'up' ? '#065f46' : 
                                     getScoreTrend() === 'down' ? '#7f1d1d' : '#475569'
                              }}
                            >
                              {getScoreTrend() === 'up' ? <FiTrendingUp /> : 
                               getScoreTrend() === 'down' ? <FiTrendingDown /> : <FiRefreshCw />}
                              {getScoreTrend() === 'up' ? 'Improving' : 
                               getScoreTrend() === 'down' ? 'Declining' : 'Stable'}
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
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="col-lg-4">
                  <div className="row y-gap-20">
                    {/* Previous Score Card */}
                    <div className="col-12">
                      <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
                        <div className="d-flex align-items-center justify-content-between mb-16">
                          <div>
                            <div className="text-14 text-gray-600 mb-2">Previous Score</div>
                            <div className="text-32 fw-700 text-gray-900">
                              {previousScore || '--'}
                            </div>
                          </div>
                          <div className="bg-light-blue p-12 rounded-circle">
                            <MdHistory size={24} className="text-primary" />
                          </div>
                        </div>
                        <div className="text-13 text-gray-500">
                          Last calculated readiness score
                        </div>
                      </div>
                    </div>

                    {/* Score Change Card */}
                    <div className="col-12">
                      <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
                        <div className="d-flex align-items-center justify-content-between mb-16">
                          <div>
                            <div className="text-14 text-gray-600 mb-2">Score Change</div>
                            <div className={`text-32 fw-700 ${scoreDelta > 0 ? 'text-success' : scoreDelta < 0 ? 'text-danger' : 'text-gray-900'}`}>
                              {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                            </div>
                          </div>
                          <div className={`p-12 rounded-circle ${scoreDelta > 0 ? 'bg-light-green' : scoreDelta < 0 ? 'bg-light-red' : 'bg-light-gray'}`}>
                            {scoreDelta > 0 ? (
                              <FiArrowUp size={24} className="text-success" />
                            ) : scoreDelta < 0 ? (
                              <FiArrowDown size={24} className="text-danger" />
                            ) : (
                              <FiRefreshCw size={24} className="text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="text-13 text-gray-500">
                          {scoreDelta > 0 ? 'Improvement since last check' : 
                           scoreDelta < 0 ? 'Decline since last check' : 
                           'No change since last check'}
                        </div>
                      </div>
                    </div>

                    {/* Last Updated Card */}
                    <div className="col-12">
                      <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-24">
                        <div className="d-flex align-items-center justify-content-between mb-16">
                          <div>
                            <div className="text-14 text-gray-600 mb-2">Last Updated</div>
                            <div className="text-20 fw-600 text-gray-900">
                              {latest ? formatDate(latest.calculated_at) : '--'}
                            </div>
                          </div>
                          <div className="bg-light-purple p-12 rounded-circle">
                            <FiCalendar size={24} className="text-purple" />
                          </div>
                        </div>
                        <div className="text-13 text-gray-500">
                          Date of latest assessment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Analysis Section */}
            {progress && activeTab === 'overview' && (
              <div className="row y-gap-30 mt-30">
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
                              <FiTrendingUp size={24} />
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
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="row y-gap-30 mt-30">
                <div className="col-12">
                  <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
                    <div className="d-flex justify-content-between align-items-center mb-30">
                      <div>
                        <h2 className="text-20 fw-600 text-gray-900 mb-2">Readiness History</h2>
                        <p className="text-gray-600">Track your readiness score over time</p>
                      </div>
                      <button className="btn btn-primary">
                        <FiRefreshCw className="me-2" />
                        Refresh Data
                      </button>
                    </div>

                    {history.length === 0 ? (
                      <div className="text-center py-40">
                        <div className="text-gray-400 mb-3">
                          <MdHistory size={48} />
                        </div>
                        <h3 className="text-18 fw-600 text-gray-700 mb-2">No History Available</h3>
                        <p className="text-gray-500">Complete more assessments to see your progress history.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr className="border-bottom">
                              <th className="text-gray-600 fw-600 py-3">Date</th>
                              <th className="text-gray-600 fw-600 py-3">Score</th>
                              <th className="text-gray-600 fw-600 py-3">Change</th>
                              <th className="text-gray-600 fw-600 py-3">Status</th>
                              <th className="text-gray-600 fw-600 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.map((record, index) => {
                              const prevScore = index < history.length - 1 ? history[index + 1]?.total_score : null;
                              const delta = prevScore ? record.total_score - prevScore : null;
                              
                              return (
                                <tr key={record.readiness_id} className="border-bottom">
                                  <td className="py-3">
                                    <div className="text-14 fw-500 text-gray-900">
                                      {formatDate(record.calculated_at)}
                                    </div>
                                    <div className="text-12 text-gray-500">
                                      {new Date(record.calculated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className={`text-16 fw-600 ${getScoreColor(record.total_score)}`}>
                                        {record.total_score}
                                      </div>
                                      <div className="text-12 text-gray-500">/100</div>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    {delta !== null ? (
                                      <div className={`text-14 fw-500 ${delta > 0 ? 'text-success' : delta < 0 ? 'text-danger' : 'text-gray-600'}`}>
                                        {delta > 0 ? '+' : ''}{delta}
                                      </div>
                                    ) : (
                                      <div className="text-14 text-gray-400">--</div>
                                    )}
                                  </td>
                                  <td className="py-3">
                                    <span className={`badge ${record.total_score >= 70 ? 'bg-success' : record.total_score >= 50 ? 'bg-warning' : 'bg-danger'} py-1 px-3 rounded-pill`}>
                                      {record.total_score >= 70 ? 'Ready' : record.total_score >= 50 ? 'Progressing' : 'Needs Work'}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <button className="btn btn-sm btn-outline-primary">
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
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
            )}

            {/* CTA Section */}
            <div className="row y-gap-30 mt-30">
              <div className="col-12">
                <div className="rounded-4 bg-gradient-primary p-30 text-white">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <h2 className="text-24 fw-700 mb-3">Ready to improve your score?</h2>
                      <p className="text-white opacity-90 mb-0">
                        Take another assessment to update your readiness score and track your progress.
                      </p>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                      <button className="btn btn-light text-primary fw-600 px-30 py-12">
                        <FiRefreshCw className="me-2" />
                        Retake Assessment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;