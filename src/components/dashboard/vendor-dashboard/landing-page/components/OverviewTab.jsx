import ScoreCard from "./ScoreCard";
import StatsCards from "./StatsCards";
import ProgressAnalysis from "./ProgressAnalysis";
import { MdTimeline } from "react-icons/md";

const OverviewTab = ({ latest, history, progress, loading, formatDate }) => {
  if (loading) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-gray-600 mt-3">Loading readiness data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="text-gray-400 mb-3">
                <MdTimeline size={48} />
              </div>
              <h3 className="text-20 fw-600 text-gray-700 mb-2">No Readiness Data</h3>
              <p className="text-gray-500">Complete your first readiness assessment to see your progress.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row y-gap-30 mt-30">
        {/* Main Score Card */}
        <div className="col-lg-8">
          <ScoreCard latest={latest} history={history} formatDate={formatDate} />
        </div>

        {/* Stats Cards */}
        <div className="col-lg-4">
          <StatsCards 
            latest={latest} 
            history={history} 
            progress={progress} 
            formatDate={formatDate} 
          />
        </div>
      </div>

      {/* Progress Analysis Section */}
      {progress && (
        <div className="row y-gap-30 mt-30">
          <ProgressAnalysis progress={progress} />
        </div>
      )}
    </>
  );
};

export default OverviewTab;