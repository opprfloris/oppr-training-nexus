
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClockIcon, DocumentTextIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { TrainingDefinition, TrainingDefinitionVersion } from '@/types/training-definitions';

interface EnhancedHeaderProps {
  isNewDefinition: boolean;
  definition: TrainingDefinition | null;
  version: TrainingDefinitionVersion | null;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  isNewDefinition,
  definition,
  version,
  showMobileMenu,
  setShowMobileMenu,
  setShowVersionHistory
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </Button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {isNewDefinition ? 'Create New Training Definition' : `Edit Training Definition`}
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Phase 5C: UI Polish & Mobile Responsiveness
            </p>
            {version && (
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mt-2">
                <p className="text-xs lg:text-sm text-gray-500">
                  Current version: {version.version_number} ({version.status})
                </p>
                {version.published_at && (
                  <p className="text-xs lg:text-sm text-green-600">
                    Published: {new Date(version.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Version Management Controls */}
        <div className={`${showMobileMenu ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-3 absolute lg:relative top-full lg:top-auto left-0 lg:left-auto right-0 lg:right-auto bg-white lg:bg-transparent border-b lg:border-b-0 border-gray-200 p-4 lg:p-0 z-10`}>
          {definition && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVersionHistory(true)}
              className="w-full lg:w-auto flex items-center justify-center space-x-2"
            >
              <ClockIcon className="w-4 h-4" />
              <span>Version History</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/desktop/training-definitions')}
            className="w-full lg:w-auto flex items-center justify-center space-x-2"
          >
            <DocumentTextIcon className="w-4 h-4" />
            <span>Back to List</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeader;
