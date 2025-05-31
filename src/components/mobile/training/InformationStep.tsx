
interface InformationStepProps {
  stepData: {
    content: string;
    imageUrl?: string;
  };
}

const InformationStep = ({ stepData }: InformationStepProps) => (
  <div className="p-6">
    {stepData.imageUrl && (
      <div className="mb-6">
        <img 
          src={stepData.imageUrl} 
          alt="Training content"
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
    )}
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-900 leading-relaxed text-lg">{stepData.content}</p>
    </div>
  </div>
);

export default InformationStep;
