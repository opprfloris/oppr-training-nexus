
import { useState } from "react";

interface AITutorModalProps {
  onClose: () => void;
  stepData: any;
}

const AITutorModal = ({ onClose, stepData }: AITutorModalProps) => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);

  const handleSendQuestion = () => {
    if (question.trim()) {
      // Add user question to conversation
      setConversation(prev => [...prev, { role: 'user', message: question }]);
      
      // Simulate AI response (in real implementation, this would call an API)
      setTimeout(() => {
        const aiResponse = "Based on the current step, I can help you understand that safety guards are crucial for preventing accidents. They act as a physical barrier between operators and moving machinery parts.";
        setConversation(prev => [...prev, { role: 'ai', message: aiResponse }]);
      }, 1000);
      
      setQuestion("");
    }
  };

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
              onKeyPress={(e) => e.key === 'Enter' && handleSendQuestion()}
            />
            <button 
              onClick={handleSendQuestion}
              className="px-6 py-3 bg-oppr-blue text-white font-medium rounded-xl hover:bg-oppr-blue/90"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorModal;
