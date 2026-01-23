import { MdHistory } from "react-icons/md";
import { FiArrowUp, FiArrowDown, FiRefreshCw, FiCalendar } from "react-icons/fi";

const StatsCards = ({ latest, history, progress, formatDate }) => {
  const previousScore = history.length > 1 ? history[history.length - 2]?.total_score : null;
  const scoreDelta = progress?.score_delta || 0;

  return (
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
  );
};

export default StatsCards;