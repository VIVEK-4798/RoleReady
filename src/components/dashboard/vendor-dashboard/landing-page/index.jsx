import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
import OverviewTab from "./components/OverviewTab";
import HistoryTab from "./components/HistoryTab";
import TrendsTab from "./components/TrendsTab";

const API_BASE = "http://localhost:5000/api";
const USER_ID = 25;
const CATEGORY_ID = 17;

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

  // Format date utility
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
                      Trends
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Render Active Tab */}
            {activeTab === 'overview' && (
              <OverviewTab 
                latest={latest}
                history={history}
                progress={progress}
                loading={loading}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab 
                history={history}
                loading={loading}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'trends' && (
              <TrendsTab 
                history={history}
                loading={loading}
                formatDate={formatDate}
              />
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