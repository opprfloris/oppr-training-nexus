
import { CheckCircleIcon, XCircleIcon, ClockIcon, MinusCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { SkillsMatrixProgress } from '@/services/skillsMatrixService';

interface StatusCellProps {
  progress?: SkillsMatrixProgress;
  onClick?: () => void;
}

export const StatusCell = ({ progress, onClick }: StatusCellProps) => {
  if (!progress) {
    return (
      <div 
        className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-50 rounded"
        onClick={onClick}
      >
        <MinusCircleIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">Not Started</span>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (progress.status) {
      case 'passed':
        return {
          icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />,
          text: `Passed (${progress.score}%)`,
          subText: progress.completed_at ? `Completed: ${new Date(progress.completed_at).toLocaleDateString()}` : '',
          bgColor: 'hover:bg-green-50'
        };
      case 'failed':
        return {
          icon: <XCircleIcon className="w-4 h-4 text-red-500" />,
          text: `Failed (${progress.score}%, Attempts: ${progress.attempt_count}/${progress.max_attempts})`,
          subText: progress.last_attempt_at ? `Last Attempt: ${new Date(progress.last_attempt_at).toLocaleDateString()}` : '',
          bgColor: 'hover:bg-red-50'
        };
      case 'in_progress':
        return {
          icon: <ClockIcon className="w-4 h-4 text-blue-500" />,
          text: `In Progress (${progress.progress_percentage}%)`,
          subText: '',
          bgColor: 'hover:bg-blue-50'
        };
      case 'expired':
        return {
          icon: <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />,
          text: 'Expired',
          subText: progress.last_attempt_at ? `Last Attempt: ${new Date(progress.last_attempt_at).toLocaleDateString()}` : '',
          bgColor: 'hover:bg-orange-50'
        };
      default:
        return {
          icon: <MinusCircleIcon className="w-4 h-4 text-gray-400" />,
          text: 'Not Started',
          subText: '',
          bgColor: 'hover:bg-gray-50'
        };
    }
  };

  const { icon, text, subText, bgColor } = getStatusDisplay();

  return (
    <div 
      className={`flex flex-col space-y-1 p-2 cursor-pointer rounded transition-colors ${bgColor}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{text}</span>
      </div>
      {subText && (
        <span className="text-xs text-gray-500 ml-6">{subText}</span>
      )}
    </div>
  );
};
