
import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const FeatureShowcase: React.FC = () => {
  return (
    <div className="w-full">
      {/* Workflow Diagram */}
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-8 p-6">
        
        {/* Step 1: Documents */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Upload Documents</h3>
          <p className="text-sm text-gray-600">PDFs, images, manuals</p>
        </div>

        <ArrowRightIcon className="w-6 h-6 text-gray-400 hidden lg:block" />
        <div className="flex lg:hidden">
          <div className="w-6 h-6 rotate-90">
            <ArrowRightIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Step 2: AI Analysis */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
          <p className="text-sm text-gray-600">Content extraction & generation</p>
        </div>

        <ArrowRightIcon className="w-6 h-6 text-gray-400 hidden lg:block" />
        <div className="flex lg:hidden">
          <div className="w-6 h-6 rotate-90">
            <ArrowRightIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Step 3: Training Creation */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Create Training</h3>
          <p className="text-sm text-gray-600">Interactive flows & steps</p>
        </div>

        <ArrowRightIcon className="w-6 h-6 text-gray-400 hidden lg:block" />
        <div className="flex lg:hidden">
          <div className="w-6 h-6 rotate-90">
            <ArrowRightIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Step 4: Deploy */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Deploy Projects</h3>
          <p className="text-sm text-gray-600">Floor plans & QR codes</p>
        </div>

        <ArrowRightIcon className="w-6 h-6 text-gray-400 hidden lg:block" />
        <div className="flex lg:hidden">
          <div className="w-6 h-6 rotate-90">
            <ArrowRightIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Step 5: Execute */}
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-2xl">📱</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Mobile Execution</h3>
          <p className="text-sm text-gray-600">QR scanning & progress tracking</p>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-center mb-6">Why Choose OPPR Training Platform?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚡</span>
            </div>
            <h4 className="font-medium mb-2">AI-Powered Efficiency</h4>
            <p className="text-sm text-gray-600">Reduce training creation time by 80% with intelligent content generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="font-medium mb-2">Real-Time Analytics</h4>
            <p className="text-sm text-gray-600">Track progress, identify gaps, and optimize training effectiveness</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔧</span>
            </div>
            <h4 className="font-medium mb-2">Industry-Focused</h4>
            <p className="text-sm text-gray-600">Built specifically for manufacturing and industrial training needs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
