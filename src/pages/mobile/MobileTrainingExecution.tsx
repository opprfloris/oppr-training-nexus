
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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

// Information Step Component
const InformationStep = ({ stepData }: { stepData: any }) => (
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
      <p className="text-gray-900 leading-relaxed">{stepData.content}</p>
    </div>
  </div>
);

// Go To Step Component
const GotoStep = ({ stepData }: { stepData: any }) => {
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

// Question Step Component
const QuestionStep = ({ stepData, onAnswer }: { stepData: any; onAnswer: () => void }) => {
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

// AI Tutor Modal Component
const AITutorModal = ({ onClose, stepData }: { onClose: () => void; stepData: any }) => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">AI Tutor</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Hint:</h4>
            <p className="text-blue-800">Safety guards are the first line of defense against accidents.</p>
          </div>

          {/* Conversation */}
          <div className="space-y-4 mb-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-oppr-blue text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-oppr-blue/20 focus:border-oppr-blue"
            />
            <button className="px-6 py-3 bg-oppr-blue text-white font-medium rounded-xl hover:bg-oppr-blue/90">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTrainingExecution;
