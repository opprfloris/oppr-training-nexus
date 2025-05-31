
import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, ClockIcon, CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

const MobileTrainings = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Mock training data - this will be replaced with real data from Supabase
  const activeTrainings = [
    {
      id: 1,
      title: "Line 8 Safety Checks V1",
      type: "Safety",
      icon: "🛡️",
      status: "Not Started",
      progress: 0,
      totalSteps: 12,
      dueDate: "2025-06-10",
      isOverdue: false,
      isNearDue: true
    },
    {
      id: 2,
      title: "Machine Operation Protocol",
      type: "Operations",
      icon: "⚙️",
      status: "In Progress",
      progress: 5,
      totalSteps: 8,
      dueDate: "2025-06-15",
      isOverdue: false,
      isNearDue: false
    },
    {
      id: 3,
      title: "Quality Control Procedures",
      type: "Quality",
      icon: "✅",
      status: "Not Started",
      progress: 0,
      totalSteps: 15,
      dueDate: "2025-06-05",
      isOverdue: true,
      isNearDue: false
    }
  ];

  const completedTrainings = [
    {
      id: 4,
      title: "Basic Safety Training",
      type: "Safety",
      icon: "🛡️",
      status: "Passed",
      score: 92,
      completedDate: "2025-05-20"
    },
    {
      id: 5,
      title: "Equipment Maintenance",
      type: "Maintenance",
      icon: "🔧",
      status: "Failed",
      score: 68,
      completedDate: "2025-05-18"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'Failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Not Started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.round((progress / total) * 100);
  };

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const TrainingCard = ({ training, isCompleted = false }: { training: any, isCompleted?: boolean }) => (
    <div className={`bg-white rounded-xl border-2 p-4 mb-4 shadow-sm ${
      !isCompleted && training.isOverdue ? 'border-red-200 bg-red-50/30' : 
      !isCompleted && training.isNearDue ? 'border-yellow-200 bg-yellow-50/30' : 
      'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-oppr-blue/10 flex items-center justify-center">
            <span className="text-lg">{training.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 leading-tight">{training.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{training.type}</p>
          </div>
        </div>
        {!isCompleted && training.isOverdue && (
          <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        {!isCompleted && training.isNearDue && (
          <ClockIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
        )}
      </div>

      {!isCompleted ? (
        <>
          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
                {training.status}
              </span>
              {training.progress > 0 && (
                <span className="text-sm text-gray-600">
                  Step {training.progress} of {training.totalSteps}
                </span>
              )}
            </div>
            
            {training.progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-oppr-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(training.progress, training.totalSteps)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${training.isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              Due: {formatDueDate(training.dueDate)}
            </span>
            {training.isOverdue && (
              <span className="text-xs text-red-600 font-medium">OVERDUE</span>
            )}
            {training.isNearDue && !training.isOverdue && (
              <span className="text-xs text-yellow-600 font-medium">DUE SOON</span>
            )}
          </div>

          {/* Action Button */}
          <button className="w-full bg-oppr-blue text-white font-semibold py-3 px-4 rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all">
            {training.status === 'Not Started' ? 'Start Training' : 'Resume Training'}
          </button>
        </>
      ) : (
        <>
          {/* Completed Training Info */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(training.status)}`}>
              {training.status}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {training.score}%
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            Completed: {formatDueDate(training.completedDate)}
          </div>

          <button className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all">
            View Summary
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search trainings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-oppr-blue focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-4 px-4 text-center font-semibold border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-oppr-blue text-oppr-blue bg-oppr-blue/5'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active & Pending
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 px-4 text-center font-semibold border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'border-oppr-blue text-oppr-blue bg-oppr-blue/5'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'active' ? (
          activeTrainings.length > 0 ? (
            <div>
              {activeTrainings.map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Trainings</h3>
              <p className="text-gray-600">Training projects assigned to you will appear here.</p>
            </div>
          )
        ) : (
          completedTrainings.length > 0 ? (
            <div>
              {completedTrainings.map(training => (
                <TrainingCard key={training.id} training={training} isCompleted={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <CheckBadgeIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Trainings</h3>
              <p className="text-gray-600">You haven't completed any trainings yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MobileTrainings;
