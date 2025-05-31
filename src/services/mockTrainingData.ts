
export interface MockTrainingStep {
  id: number;
  type: "information" | "goto" | "question";
  content?: string;
  imageUrl?: string | null;
  instructions?: string;
  questionType?: "multiple_choice";
  questionText?: string;
  options?: string[];
  correctAnswer?: number;
}

export interface MockTrainingData {
  id: string;
  title: string;
  totalSteps: number;
  steps: MockTrainingStep[];
}

export const getMockTrainingData = (trainingId: string): MockTrainingData => {
  return {
    id: trainingId || "1",
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
};
