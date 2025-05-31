
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface TrainingNavigationProps {
  onBack: () => void;
  onNext: () => void;
}

const TrainingNavigation = ({ onBack, onNext }: TrainingNavigationProps) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center px-6 py-3 bg-oppr-blue text-white font-bold rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all"
        >
          Next
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TrainingNavigation;
