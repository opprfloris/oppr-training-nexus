
import InformationStep from "./InformationStep";
import GotoStep from "./GotoStep";
import QuestionStep from "./QuestionStep";
import { MockTrainingStep } from "@/services/mockTrainingData";

interface StepRendererProps {
  stepData: MockTrainingStep;
  onNext: () => void;
}

const StepRenderer = ({ stepData, onNext }: StepRendererProps) => {
  const renderStepContent = () => {
    switch (stepData.type) {
      case "information":
        return (
          <InformationStep 
            stepData={{
              content: stepData.content || "",
              imageUrl: stepData.imageUrl || undefined
            }} 
          />
        );
      case "goto":
        return (
          <GotoStep 
            stepData={{
              instructions: stepData.instructions || ""
            }} 
          />
        );
      case "question":
        return (
          <QuestionStep 
            stepData={{
              questionText: stepData.questionText || "",
              options: stepData.options || [],
              correctAnswer: stepData.correctAnswer || 0
            }} 
            onAnswer={onNext} 
          />
        );
      default:
        return <div>Unknown step type</div>;
    }
  };

  return renderStepContent();
};

export default StepRenderer;
