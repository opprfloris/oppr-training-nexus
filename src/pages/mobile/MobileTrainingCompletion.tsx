
import { useLocation, useNavigate } from "react-router-dom";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

const MobileTrainingCompletion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trainingId = location.state?.trainingId;

  // Mock completion data - this will be replaced with real data from Supabase
  const completionData = {
    trainingTitle: "Line 8 Safety Checks V1",
    status: "passed", // "passed" or "failed"
    score: 85,
    totalPoints: 100,
    percentage: 85,
    breakdown: [
      { category: "Emergency Stops", status: "excellent", score: 100 },
      { category: "Machine Guarding", status: "review", score: 75 },
      { category: "PPE Usage", status: "excellent", score: 95 }
    ],
    retakesAllowed: true,
    improvementAreas: "Review machine guarding procedures, particularly the inspection checklist for moving parts."
  };

  const isPassed = completionData.status === "passed";

  const getCategoryIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckBadgeIcon className="w-6 h-6 text-green-500" />;
      case "review":
        return <XCircleIcon className="w-6 h-6 text-yellow-500" />;
      default:
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
    }
  };

  const getCategoryText = (status: string) => {
    switch (status) {
      case "excellent":
        return "All Correct!";
      case "review":
        return "Needs Review";
      default:
        return "Needs Improvement";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-6 text-center">
        <div className="mb-4">
          {isPassed ? (
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <CheckBadgeIcon className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <XCircleIcon className="w-10 h-10 text-red-600" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isPassed ? "Training Complete!" : "Training Needs Review"}
        </h1>
        
        <p className="text-gray-600 font-medium">{completionData.trainingTitle}</p>
      </header>

      {/* Results */}
      <div className="p-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="text-center mb-6">
            <div className={`text-lg font-semibold mb-2 ${
              isPassed ? 'text-green-600' : 'text-red-600'
            }`}>
              Status: {isPassed ? 'Passed' : 'Needs Review'}
            </div>
            
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {completionData.score} / {completionData.totalPoints}
            </div>
            
            <div className="text-xl text-gray-600">
              ({completionData.percentage}%)
            </div>
          </div>

          {/* Progress Ring Visualization */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * completionData.percentage) / 100}
                  className={isPassed ? "text-green-500" : "text-red-500"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {completionData.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Breakdown</h3>
          
          <div className="space-y-4">
            {completionData.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(item.status)}
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.score}%</div>
                  <div className={`text-sm ${
                    item.status === 'excellent' ? 'text-green-600' : 
                    item.status === 'review' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getCategoryText(item.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Areas */}
        {!isPassed && completionData.improvementAreas && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">Areas for Improvement</h3>
            <p className="text-yellow-800 leading-relaxed">{completionData.improvementAreas}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/mobile/trainings')}
            className="w-full bg-oppr-blue text-white font-bold py-4 px-6 rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all"
          >
            Return to Dashboard
          </button>
          
          {!isPassed && completionData.retakesAllowed && (
            <button
              onClick={() => navigate(`/mobile/training-execution/${trainingId}`)}
              className="w-full bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              Retake Training
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTrainingCompletion;
