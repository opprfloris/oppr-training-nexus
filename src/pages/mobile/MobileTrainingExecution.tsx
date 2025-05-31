
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import InformationStep from "@/components/mobile/training/InformationStep";
import GotoStep from "@/components/mobile/training/GotoStep";
import QuestionStep from "@/components/mobile/training/QuestionStep";
import AITutorModal from "@/components/mobile/training/AITutorModal";

const MobileTrainingExecution = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAITutor, setShowAITutor] = useState(false);

  // Mock training data - this will be replaced with real data from Supabase
  const trainingData = {
    id: trainingId,
    title: "Line 8 Safety Checks V1",
    totalSteps: 15,
    steps: [
      {
        id: 1,
        type: "information",
        content: "Welcome to Line 8 Safety! This training will cover critical safety procedures. Please pay close attention to all steps.",
        imageUrl: null
      },
      {
        id: 2,
        type: "goto",
        instructions: "Proceed to Emergency Stop Button ES-01 on Assembly Line 3. When you arrive, scan the QR code on the machine."
      },
      {
        id: 3,
        type: "question",
        questionType: "multiple_choice",
        questionText: "What is the first thing you should do before operating any machinery?",
        options: [
          "Start the machine immediately",
          "Check all safety guards are in place",
          "Call your supervisor",
          "Read the manual"
        ],
        correctAnswer: 1
      }
    ]
  };

  const currentStepData = trainingData.steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < trainingData.totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/mobile/training-completion', { state: { trainingId } });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/mobile/trainings');
    }
  };

  const renderStepContent = () => {
    switch (currentStepData?.type) {
      case "information":
        return <InformationStep stepData={currentStepData} />;
      case "goto":
        return <GotoStep stepData={currentStepData} />;
      case "question":
        return <QuestionStep stepData={currentStepData} onAnswer={handleNext} />;
      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 truncate">{trainingData.title}</h1>
            <p className="text-sm text-gray-600">Step {currentStep} of {trainingData.totalSteps}</p>
          </div>
          <button
            onClick={() => setShowAITutor(true)}
            className="p-2 text-oppr-blue hover:bg-oppr-blue/10 rounded-lg transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-oppr-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / trainingData.totalSteps) * 100}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderStepContent()}
      </main>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-oppr-blue text-white font-bold rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all"
          >
            Next
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* AI Tutor Modal */}
      {showAITutor && (
        <AITutorModal onClose={() => setShowAITutor(false)} stepData={currentStepData} />
      )}
    </div>
  );
};

export default MobileTrainingExecution;
