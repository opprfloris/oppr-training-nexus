
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMockTrainingData } from "@/services/mockTrainingData";
import TrainingHeader from "@/components/mobile/training/TrainingHeader";
import StepRenderer from "@/components/mobile/training/StepRenderer";
import TrainingNavigation from "@/components/mobile/training/TrainingNavigation";
import AITutorModal from "@/components/mobile/training/AITutorModal";

const MobileTrainingExecution = () => {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAITutor, setShowAITutor] = useState(false);

  const trainingData = getMockTrainingData(trainingId || "1");
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TrainingHeader
        title={trainingData.title}
        currentStep={currentStep}
        totalSteps={trainingData.totalSteps}
        onAITutorClick={() => setShowAITutor(true)}
      />

      <main className="flex-1 overflow-auto">
        <StepRenderer stepData={currentStepData} onNext={handleNext} />
      </main>

      <TrainingNavigation onBack={handleBack} onNext={handleNext} />

      {showAITutor && (
        <AITutorModal onClose={() => setShowAITutor(false)} stepData={currentStepData} />
      )}
    </div>
  );
};

export default MobileTrainingExecution;
