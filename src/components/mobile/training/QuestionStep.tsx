
import { useState } from "react";

interface QuestionStepProps {
  stepData: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  };
  onAnswer: () => void;
}

const QuestionStep = ({ stepData, onAnswer }: QuestionStepProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      // Process answer logic here
      onAnswer();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{stepData.questionText}</h3>
        
        <div className="space-y-3">
          {stepData.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-oppr-blue bg-oppr-blue/10 text-oppr-blue'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === index ? 'border-oppr-blue bg-oppr-blue' : 'border-gray-400'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setSelectedAnswer(null)}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Clear Selection
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="flex-1 px-6 py-3 bg-oppr-blue text-white font-bold rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionStep;
