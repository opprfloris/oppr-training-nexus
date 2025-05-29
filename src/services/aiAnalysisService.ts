
import { useAISettings } from '@/contexts/AISettingsContext';

interface AIAnalysisRequest {
  content: string;
  fileName: string;
  prompt?: string;
}

interface AIAnalysisResponse {
  analysis: string;
  error?: string;
}

export const analyzeDocumentWithAI = async (request: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
  // Get AI configuration from localStorage since we can't use hooks in a service
  const savedConfig = localStorage.getItem('ai-settings');
  let config = {
    apiKey: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4000
  };

  if (savedConfig) {
    try {
      config = { ...config, ...JSON.parse(savedConfig) };
    } catch (error) {
      console.error('Failed to parse AI config:', error);
    }
  }

  // Get the analysis prompt
  const analysisPrompt = request.prompt || localStorage.getItem('ai-analysis-prompt') || `Analyze this training document and provide a simple, helpful summary.

Focus on:
- Main topics and themes
- Key learning points
- Suggested training approach
- Content difficulty level

Keep the response concise and actionable for training developers.`;

  console.log('Using AI analysis prompt:', analysisPrompt);
  console.log('Using AI config:', { ...config, apiKey: config.apiKey ? '***' : 'none' });

  if (!config.apiKey) {
    return {
      analysis: generateFallbackAnalysis(request.content, request.fileName),
      error: 'No API key configured'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert training analyst. Analyze documents and provide helpful insights for training developers.'
          },
          {
            role: 'user',
            content: `${analysisPrompt}\n\nDocument: ${request.fileName}\nContent: ${request.content}`
          }
        ],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('AI API response received:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from AI');
    }

    return {
      analysis: data.choices[0].message.content
    };

  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return {
      analysis: generateFallbackAnalysis(request.content, request.fileName),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const generateFallbackAnalysis = (content: string, fileName: string): string => {
  const words = content.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  // Basic topic detection for fallback
  const topicPatterns = [
    { pattern: /safety|hazard|risk|protection|emergency/gi, topic: 'Safety' },
    { pattern: /equipment|machine|tool|device/gi, topic: 'Equipment' },
    { pattern: /quality|standard|specification/gi, topic: 'Quality' },
    { pattern: /procedure|process|workflow|method/gi, topic: 'Procedures' },
    { pattern: /maintenance|repair|service/gi, topic: 'Maintenance' },
    { pattern: /training|education|skill/gi, topic: 'Training' }
  ];

  const detectedTopics = topicPatterns
    .filter(({ pattern }) => content.match(pattern))
    .map(({ topic }) => topic)
    .slice(0, 6);

  return `**Document Analysis: ${fileName}**

Document contains ${words} words (${readingTime} minute read).

**Main Topics:**
${detectedTopics.length > 0 ? detectedTopics.map(topic => `• ${topic}`).join('\n') : '• General operational procedures'}

**Content Assessment:**
• Difficulty: ${words > 2000 ? 'Advanced' : words > 1000 ? 'Intermediate' : 'Basic'} level
• Format: ${words > 1000 ? 'Detailed documentation' : 'Concise guide'}

**Training Recommendations:**
• Duration: ${Math.max(10, Math.min(30, readingTime * 2))} minutes
• Questions: ${Math.max(3, Math.min(15, Math.floor(words / 200)))}
• Approach: ${words > 1500 ? 'Interactive workshop' : 'Overview with examples'}

*Note: This is a basic analysis. Configure AI settings with an API key for enhanced analysis using your custom prompts.*`;
};
