import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Upload, FileText, X, AlertCircle, Target, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DocumentUploader from './DocumentUploader';
import ContentSummary from './ContentSummary';
import SmartAnalysisTabs from './SmartAnalysisTabs';
import AIFlowPreview from './AIFlowPreview';
import { StepBlock } from '@/types/training-definitions';

interface FlowCanvasAIAssistantProps {
  onApplyFlow: (blocks: StepBlock[]) => void;
}

interface FlowGenerationConfig {
  objective: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  includeInformation: boolean;
  includeGoto: boolean;
  focusAreas: string[];
}

const FlowCanvasAIAssistant: React.FC<FlowCanvasAIAssistantProps> = ({ onApplyFlow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FlowGenerationConfig>({
    objective: '',
    questionCount: 8,
    difficulty: 'medium',
    questionTypes: ['multiple_choice'],
    includeInformation: true,
    includeGoto: false,
    focusAreas: []
  });
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [generatedFlow, setGeneratedFlow] = useState<StepBlock[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleDocumentUpload = (file: File, content: string, images: string[] = []) => {
    setUploadedDocument(file);
    setDocumentContent(content);
    setExtractedImages(images);
    
    // Auto-extract focus areas from document content
    const detectedAreas = extractFocusAreas(content);
    setConfig(prev => ({ ...prev, focusAreas: detectedAreas }));
    
    toast({
      title: "Document Processed",
      description: `${file.name} analyzed. Found ${images.length} images and ${detectedAreas.length} focus areas.`
    });
  };

  const extractFocusAreas = (content: string): string[] => {
    const areas = [];
    if (content.toLowerCase().includes('safety')) areas.push('Safety Protocols');
    if (content.toLowerCase().includes('equipment')) areas.push('Equipment Operation');
    if (content.toLowerCase().includes('quality')) areas.push('Quality Control');
    if (content.toLowerCase().includes('emergency')) areas.push('Emergency Procedures');
    if (content.toLowerCase().includes('maintenance')) areas.push('Maintenance');
    if (content.toLowerCase().includes('documentation')) areas.push('Documentation');
    return areas;
  };

  const generateDifficultyBasedQuestion = (
    area: string, 
    index: number, 
    difficulty: string, 
    questionType: string,
    documentSnippet?: string
  ) => {
    const baseQuestions = {
      easy: {
        safety: 'What is the first step in safety protocols?',
        equipment: 'Which safety equipment is required?',
        quality: 'What is the quality standard requirement?',
        emergency: 'Where is the emergency assembly point?'
      },
      medium: {
        safety: 'How would you respond to a safety violation scenario?',
        equipment: 'Describe the proper equipment maintenance procedure.',
        quality: 'What steps would you take if quality standards are not met?',
        emergency: 'Explain the emergency evacuation procedure for your area.'
      },
      hard: {
        safety: 'Analyze a complex safety situation and determine the most appropriate response strategy.',
        equipment: 'Evaluate equipment performance data and recommend optimization strategies.',
        quality: 'Design a quality improvement plan for a failing process.',
        emergency: 'Develop an emergency response plan for multiple simultaneous incidents.'
      }
    };

    const areaKey = area.toLowerCase().split(' ')[0] as keyof typeof baseQuestions.easy;
    const questionText = baseQuestions[difficulty as keyof typeof baseQuestions]?.[areaKey] || 
                        `${difficulty === 'easy' ? 'What' : difficulty === 'medium' ? 'How' : 'Analyze'} ${area.toLowerCase()} in this context?`;

    let options: string[] = [];
    let correctOption = 0;
    let hint = '';
    let idealAnswer = '';

    if (questionType === 'multiple_choice') {
      if (difficulty === 'easy') {
        options = [
          'Follow the standard procedure',
          'Skip the safety check',
          'Proceed without verification',
          'Ignore the guidelines'
        ];
        hint = 'Always prioritize safety and follow established procedures.';
      } else if (difficulty === 'medium') {
        options = [
          'Assess the situation and apply appropriate protocols',
          'Apply a generic solution',
          'Wait for supervisor instructions',
          'Ignore the issue'
        ];
        hint = 'Consider the specific circumstances and apply relevant knowledge.';
      } else {
        options = [
          'Conduct comprehensive analysis and implement strategic solution',
          'Apply quick fix without analysis',
          'Escalate without initial assessment',
          'Delay decision making'
        ];
        hint = 'Advanced problems require thorough analysis and strategic thinking.';
      }
    } else {
      if (difficulty === 'easy') {
        idealAnswer = 'A basic, direct response following standard procedures';
        hint = 'Provide a straightforward answer based on basic principles.';
      } else if (difficulty === 'medium') {
        idealAnswer = 'A detailed explanation with step-by-step approach and reasoning';
        hint = 'Explain your approach with clear reasoning and steps.';
      } else {
        idealAnswer = 'A comprehensive analysis with multiple considerations, risk assessment, and strategic recommendations';
        hint = 'Provide thorough analysis considering multiple factors and implications.';
      }
    }

    // Enhance hint with document snippet if available
    if (documentSnippet) {
      const snippet = documentSnippet.substring(0, 150) + '...';
      hint += ` Document reference: "${snippet}" - ${uploadedDocument?.name}, extracted content.`;
    }

    return {
      questionText,
      options,
      correctOption,
      idealAnswer,
      hint,
      points: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15
    };
  };

  const generateFlow = async () => {
    if (!config.objective.trim()) {
      toast({
        title: "Missing Objective",
        description: "Please provide a training objective to generate the flow.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));

      const blocks: StepBlock[] = [];
      let order = 0;

      // Add comprehensive information block
      if (config.includeInformation) {
        let infoContent = `# ${config.objective} - Training Overview\n\n`;
        
        if (documentContent) {
          infoContent += `This training is based on comprehensive documentation and covers the following key areas:\n\n`;
          config.focusAreas.forEach(area => {
            infoContent += `• ${area}\n`;
          });
          infoContent += `\n**Learning Objectives:**\n`;
          infoContent += `By the end of this training, you will be able to understand and apply the principles outlined in the source material, demonstrate proficiency in key procedures, and respond appropriately to various scenarios.\n\n`;
          infoContent += `**Training Material Source:** ${uploadedDocument?.name}\n`;
        } else {
          infoContent += `This comprehensive training will help you master the essential concepts and practical applications related to ${config.objective}.\n\n`;
          infoContent += `**Key Learning Outcomes:**\n`;
          infoContent += `• Understand fundamental principles\n`;
          infoContent += `• Apply knowledge in practical scenarios\n`;
          infoContent += `• Demonstrate competency in assessment\n`;
        }

        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'information',
          order: order++,
          config: {
            content: infoContent,
            image_url: extractedImages.length > 0 ? extractedImages[0] : undefined
          }
        });
      }

      // Generate sophisticated questions
      const focusAreas = config.focusAreas.length > 0 ? config.focusAreas : ['General Knowledge'];
      const questionsPerArea = Math.ceil(config.questionCount / focusAreas.length);

      for (const area of focusAreas) {
        const areaQuestions = Math.min(questionsPerArea, config.questionCount - (blocks.length - (config.includeInformation ? 1 : 0)));
        
        for (let i = 0; i < areaQuestions; i++) {
          const questionType = config.questionTypes[i % config.questionTypes.length];
          
          // Extract relevant document snippet for this question
          let documentSnippet = '';
          if (documentContent) {
            const areaRegex = new RegExp(`[^.]*${area.toLowerCase()}[^.]*\\.`, 'i');
            const match = documentContent.match(areaRegex);
            documentSnippet = match ? match[0] : '';
          }

          const questionData = generateDifficultyBasedQuestion(
            area, 
            i, 
            config.difficulty, 
            questionType, 
            documentSnippet
          );

          blocks.push({
            id: `block_${Date.now()}_${order}`,
            type: 'question',
            order: order++,
            config: {
              question_text: `**${area}** - ${questionData.questionText}`,
              question_type: questionType as any,
              options: questionType === 'multiple_choice' ? questionData.options : undefined,
              correct_option: questionType === 'multiple_choice' ? questionData.correctOption : undefined,
              ideal_answer: questionType !== 'multiple_choice' ? questionData.idealAnswer : undefined,
              hint: questionData.hint,
              points: questionData.points,
              mandatory: true,
              image_url: extractedImages.length > i + 1 ? extractedImages[i + 1] : undefined
            }
          });
        }
      }

      // Add goto block if requested
      if (config.includeGoto) {
        blocks.push({
          id: `block_${Date.now()}_${order}`,
          type: 'goto',
          order: order++,
          config: {
            instructions: `Proceed to the practical assessment area for hands-on evaluation of ${config.objective}. Ensure you have completed all theoretical components before proceeding. Follow all safety protocols and have your training materials readily available.`
          }
        });
      }

      setGeneratedFlow(blocks);
      setShowPreview(true);
      
      toast({
        title: "Training Flow Generated",
        description: `Created ${blocks.length} blocks with ${config.difficulty} difficulty level${documentContent ? ' based on uploaded document' : ''}.`
      });
    } catch (error) {
      console.error('Error generating flow:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate training flow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyFlow = (editedBlocks: StepBlock[]) => {
    onApplyFlow(editedBlocks);
    setIsOpen(false);
    setShowPreview(false);
    setGeneratedFlow(null);
    toast({
      title: "Training Flow Applied",
      description: "AI-generated training flow with enhanced content has been applied to your canvas."
    });
  };

  const resetForm = () => {
    setConfig({
      objective: '',
      questionCount: 8,
      difficulty: 'medium',
      questionTypes: ['multiple_choice'],
      includeInformation: true,
      includeGoto: false,
      focusAreas: []
    });
    setUploadedDocument(null);
    setDocumentContent('');
    setExtractedImages([]);
    setGeneratedFlow(null);
    setShowPreview(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 25MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate enhanced PDF processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Enhanced mock content with structured sections
      const enhancedContent = `TRAINING DOCUMENT: ${file.name}

EXECUTIVE SUMMARY
This comprehensive training document covers essential operational procedures, safety protocols, and quality standards. The material is designed for both new employees and ongoing professional development.

SECTION 1: SAFETY PROTOCOLS
- Personal Protective Equipment (PPE) requirements must be followed at all times
- Emergency evacuation procedures are outlined in Section 4.2
- Hazard identification and reporting protocols are mandatory for all personnel
- Regular safety audits ensure compliance with industry standards

"Safety is our top priority. All personnel must complete safety training before beginning operations." - Safety Manual, Chapter 1

SECTION 2: EQUIPMENT OPERATION
Standard operating procedures for all machinery:
1. Pre-operation inspection checklist
2. Proper startup and shutdown sequences
3. Routine maintenance scheduling
4. Troubleshooting common issues

Key insight: "Equipment failure often results from inadequate pre-operation checks. A 5-minute inspection can prevent hours of downtime." - Equipment Manual, Page 47

SECTION 3: QUALITY CONTROL MEASURES
Quality standards must be maintained throughout all processes:
- Regular calibration of measuring instruments
- Documentation of all quality control checks
- Immediate reporting of any deviations from standards
- Continuous improvement initiatives

SECTION 4: EMERGENCY PROCEDURES
Emergency response protocols include:
- Fire evacuation procedures (Assembly Point A - Parking Lot East)
- Medical emergency response (Contact: 911, then Safety Coordinator)
- Equipment malfunction procedures
- Chemical spill response protocols

"In emergency situations, follow the established protocols without deviation. Quick, decisive action saves lives." - Emergency Response Guide, Section 1.1

SECTION 5: DOCUMENTATION REQUIREMENTS
All activities must be properly documented:
- Daily operation logs
- Maintenance records
- Quality control reports
- Incident reports
- Training completion certificates

SECTION 6: PERFORMANCE METRICS
Key performance indicators include:
- Safety incident rates (Target: Zero incidents)
- Quality compliance scores (Target: 99.5%)
- Equipment uptime (Target: 95%)
- Training completion rates (Target: 100%)

CONCLUSION
Adherence to these procedures ensures safe, efficient, and high-quality operations. Regular review and updates of these procedures maintain their effectiveness and relevance.`;

      const extractedImages = simulateImageExtraction(file.name);
      const keyTopics = extractKeyTopics(enhancedContent);
      
      const processedDoc: any = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };

      setUploadedDocument(processedDoc);
      setDocumentContent(enhancedContent);
      setExtractedImages(extractedImages);
      
      // Auto-extract focus areas from document content
      const detectedAreas = extractFocusAreas(enhancedContent);
      setConfig(prev => ({ ...prev, focusAreas: detectedAreas }));
      
      toast({
        title: "Document Processed",
        description: `${file.name} analyzed. Found ${extractedImages.length} images and ${detectedAreas.length} focus areas.`
      });
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the PDF. Please try again.",
        variant: "destructive"
      });
      setUploadedDocument(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedDocument(null);
    setDocumentContent('');
    setExtractedImages([]);
    setConfig(prev => ({ ...prev, focusAreas: [] }));
    // Reset the input value
    const input = document.getElementById('pdf-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const extractKeyTopics = (content: string): string[] => {
    // Enhanced topic extraction simulation
    const commonTopics = [
      'Safety protocols', 'Equipment operation', 'Quality control', 'Emergency procedures',
      'Documentation requirements', 'Maintenance procedures', 'Compliance standards',
      'Risk assessment', 'Training objectives', 'Performance metrics'
    ];
    
    const topics = commonTopics.filter(() => Math.random() > 0.6);
    return topics.length > 0 ? topics : ['General procedures', 'Best practices'];
  };

  const simulateImageExtraction = (fileName: string): string[] => {
    // Simulate extracted images from PDF
    const imageCount = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: imageCount }, (_, i) => 
      `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`
    );
  };

  const analyzeContent = (text: string): any => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Analyze complexity based on sentence length, vocabulary, and structure
    const complexity: 'basic' | 'intermediate' | 'advanced' = 
      avgWordsPerSentence > 20 ? 'advanced' :
      avgWordsPerSentence > 12 ? 'intermediate' : 'basic';

    // Enhanced topic extraction with importance scoring
    const topicPatterns = [
      { pattern: /safety|hazard|risk|protection|emergency|incident/gi, topic: 'Safety & Risk Management', weight: 0.9 },
      { pattern: /equipment|machine|tool|device|apparatus|instrument/gi, topic: 'Equipment & Machinery', weight: 0.8 },
      { pattern: /quality|standard|specification|requirement|compliance/gi, topic: 'Quality & Standards', weight: 0.85 },
      { pattern: /procedure|process|workflow|method|protocol/gi, topic: 'Procedures & Processes', weight: 0.75 },
      { pattern: /maintenance|repair|service|inspection|calibration/gi, topic: 'Maintenance & Service', weight: 0.7 },
      { pattern: /training|education|skill|competency|certification/gi, topic: 'Training & Development', weight: 0.6 },
      { pattern: /documentation|record|report|log|documentation/gi, topic: 'Documentation & Records', weight: 0.65 },
      { pattern: /regulation|law|legal|compliance|audit/gi, topic: 'Regulatory Compliance', weight: 0.8 }
    ];

    const keyTopics: string[] = [];
    const contentSections: { section: string; importance: number; questionPotential: number }[] = [];

    topicPatterns.forEach(({ pattern, topic, weight }) => {
      const matches = text.match(pattern);
      if (matches && matches.length >= 2) {
        keyTopics.push(topic);
        
        // Calculate question potential based on content density and importance
        const density = matches.length / words * 1000; // per 1000 words
        const questionPotential = Math.min(100, density * weight * 50);
        
        contentSections.push({
          section: topic,
          importance: weight * 100,
          questionPotential
        });
      }
    });

    // Sort by importance
    contentSections.sort((a, b) => b.importance - a.importance);

    // Suggest question count based on content length and complexity
    const baseQuestions = Math.max(3, Math.min(20, Math.floor(words / 200)));
    const complexityMultiplier = complexity === 'advanced' ? 1.3 : complexity === 'intermediate' ? 1.1 : 0.9;
    const suggestedQuestionCount = Math.round(baseQuestions * complexityMultiplier);

    // Estimate difficulty based on complexity and technical content
    const technicalTerms = text.match(/\b[A-Z]{2,}\b|\b\w+tion\b|\b\w+ment\b/g)?.length || 0;
    const technicalDensity = technicalTerms / words;
    
    const estimatedDifficulty: 'easy' | 'medium' | 'hard' = 
      complexity === 'advanced' && technicalDensity > 0.05 ? 'hard' :
      complexity === 'intermediate' || technicalDensity > 0.03 ? 'medium' : 'easy';

    // Reading level (simplified Flesch-Kincaid approximation)
    const readingLevel = Math.max(6, Math.min(18, 
      0.39 * avgWordsPerSentence + 11.8 * (text.match(/[aeiou]/gi)?.length || 0) / words - 15.59
    ));

    return {
      complexity,
      keyTopics: keyTopics.slice(0, 6), // Top 6 topics
      suggestedQuestionCount,
      estimatedDifficulty,
      readingLevel,
      contentSections: contentSections.slice(0, 8) // Top 8 sections
    };
  };

  const generateContentSummary = (content: string, fileName: string): string => {
    // Generate a smart summary based on content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length < 2) return "Document contains basic procedural information for training purposes.";
    
    const hasEmergency = content.toLowerCase().includes('emergency');
    const hasSafety = content.toLowerCase().includes('safety');
    const hasEquipment = content.toLowerCase().includes('equipment');
    
    let summary = "This document covers ";
    const topics = [];
    if (hasSafety) topics.push("safety protocols");
    if (hasEquipment) topics.push("equipment procedures");
    if (hasEmergency) topics.push("emergency procedures");
    if (topics.length === 0) topics.push("operational procedures");
    
    summary += topics.join(", ");
    summary += " with detailed instructions and guidelines for comprehensive training implementation.";
    
    return summary;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Brain className="w-4 h-4 mr-2" />
          AI Flow Generator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Advanced AI Training Flow Generator</span>
          </DialogTitle>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6">
            {/* Container 1: Document Overview */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Document Overview
              </h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {!uploadedDocument ? (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Upload a PDF document to generate content-specific questions and training materials
                      </p>
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isProcessing}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                        disabled={isProcessing}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing Document...' : 'Choose PDF File'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium">{uploadedDocument.name}</p>
                            <p className="text-xs text-gray-500">
                              {(uploadedDocument.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Content Summary */}
                      <ContentSummary
                        fileName={uploadedDocument.name}
                        pageCount={Math.floor(Math.random() * 20) + 5}
                        summary={generateContentSummary(documentContent, uploadedDocument.name)}
                      />
                    </div>
                  )}
                </div>
                
                {isProcessing && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">
                        Processing PDF... Extracting content, images, and analyzing topics
                      </span>
                    </div>
                  </div>
                )}

                {!uploadedDocument && (
                  <div className="flex items-start space-x-2 text-xs text-gray-500">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Enhanced PDF Processing Features:</p>
                      <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>Automatic text extraction and content analysis</li>
                        <li>Image extraction for visual training materials</li>
                        <li>Smart content complexity analysis and recommendations</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Container 2: Smart Content Analysis */}
            {uploadedDocument && (
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Smart Content Analysis
                </h3>
                
                <SmartAnalysisTabs analysis={analyzeContent(documentContent)} />
              </div>
            )}

            {/* Container 3: Training Configuration */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-green-600" />
                Training Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="objective" className="text-sm font-medium text-gray-700 mb-2 block">
                    Learning Objectives
                  </Label>
                  <Textarea
                    id="objective"
                    value={config.objective}
                    onChange={(e) => setConfig(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="Describe the comprehensive learning objectives for this training program..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="questionCount" className="text-sm font-medium">Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="3"
                      max="25"
                      value={config.questionCount}
                      onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 8 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
                    <Select value={config.difficulty} onValueChange={(value: any) => setConfig(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy - Basic recall</SelectItem>
                        <SelectItem value="medium">Medium - Application</SelectItem>
                        <SelectItem value="hard">Hard - Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="includeGoto"
                      checked={config.includeGoto}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeGoto: e.target.checked }))}
                    />
                    <Label htmlFor="includeGoto" className="text-sm">Practical Component</Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Question Types</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: 'multiple_choice', label: 'Multiple Choice' },
                      { value: 'text_input', label: 'Text Input' },
                      { value: 'numerical_input', label: 'Numerical' },
                      { value: 'voice_input', label: 'Voice Input' }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.questionTypes.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig(prev => ({ ...prev, questionTypes: [...prev.questionTypes, type.value] }));
                            } else {
                              setConfig(prev => ({ ...prev, questionTypes: prev.questionTypes.filter(t => t !== type.value) }));
                            }
                          }}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button 
                onClick={generateFlow}
                disabled={isGenerating || !config.objective.trim() || config.questionTypes.length === 0}
              >
                {isGenerating ? 'Generating Advanced Training Flow...' : 'Generate Training Flow'}
              </Button>
            </div>
          </div>
        ) : (
          <AIFlowPreview
            blocks={generatedFlow || []}
            onApply={handleApplyFlow}
            onBack={() => setShowPreview(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FlowCanvasAIAssistant;
