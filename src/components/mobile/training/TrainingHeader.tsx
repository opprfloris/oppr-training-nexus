
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface TrainingHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onAITutorClick: () => void;
}

const TrainingHeader = ({ title, currentStep, totalSteps, onAITutorClick }: TrainingHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
          <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>
        <button
          onClick={onAITutorClick}
          className="p-2 text-oppr-blue hover:bg-oppr-blue/10 rounded-lg transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-oppr-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </header>
  );
};

export default TrainingHeader;
