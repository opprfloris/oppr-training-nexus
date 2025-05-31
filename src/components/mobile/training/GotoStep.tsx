
import { useNavigate } from "react-router-dom";

interface GotoStepProps {
  stepData: {
    instructions: string;
  };
}

const GotoStep = ({ stepData }: GotoStepProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-oppr-blue/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">📍</span>
      </div>
      <div className="mb-8">
        <p className="text-lg text-gray-900 leading-relaxed">{stepData.instructions}</p>
      </div>
      <button
        onClick={() => navigate('/mobile/qr-scanner')}
        className="w-full bg-oppr-blue text-white font-bold py-4 px-6 rounded-xl hover:bg-oppr-blue/90 active:scale-[0.98] transition-all"
      >
        Scan QR at Location
      </button>
    </div>
  );
};

export default GotoStep;
