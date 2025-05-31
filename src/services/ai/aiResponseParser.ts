
import { StepBlock } from '@/types/training-definitions';

export const parseAIResponse = (data: any): StepBlock[] => {
  console.log('AI Flow Generation response received:', data);

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response generated from AI');
  }

  const responseContent = data.choices[0].message.content.trim();
  console.log('Raw AI response content:', responseContent);
  
  try {
    // Try to extract JSON if the response has extra text
    let jsonContent = responseContent;
    
    // Look for JSON block markers
    const jsonStart = responseContent.indexOf('{');
    const jsonEnd = responseContent.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonContent = responseContent.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Extracted JSON content:', jsonContent);
    
    const parsedResponse = JSON.parse(jsonContent);
    
    if (parsedResponse.blocks && Array.isArray(parsedResponse.blocks)) {
      console.log('Successfully parsed AI response with', parsedResponse.blocks.length, 'blocks');
      return parsedResponse.blocks;
    } else {
      console.error('Invalid response structure - missing blocks array');
      throw new Error('Invalid response structure - missing blocks array');
    }
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError);
    console.error('Response content was:', responseContent);
    throw new Error(`AI response was not valid JSON: ${parseError.message}`);
  }
};
