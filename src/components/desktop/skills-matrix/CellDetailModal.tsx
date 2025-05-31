
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusCell } from './StatusCell';
import { SkillsMatrixOperator, SkillsMatrixTrainingProject, SkillsMatrixProgress } from '@/services/skillsMatrixService';
import { ExternalLinkIcon } from '@heroicons/react/24/outline';

interface CellDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: SkillsMatrixOperator | null;
  project: SkillsMatrixTrainingProject | null;
  progress: SkillsMatrixProgress | null;
}

export const CellDetailModal = ({
  isOpen,
  onClose,
  operator,
  project,
  progress
}: CellDetailModalProps) => {
  if (!operator || !project) return null;

  const getFullName = () => {
    return `${operator.first_name || ''} ${operator.last_name || ''}`.trim() || 'Unknown';
  };

  const getAttemptHistory = () => {
    if (!progress) return [];
    
    // For now, we'll show the current attempt
    // In a real implementation, you'd have a separate table for attempt history
    return [{
      attempt: progress.attempt_count,
      date: progress.last_attempt_at || progress.completed_at,
      score: progress.score,
      status: progress.status
    }];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Training Progress Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operator and Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Operator</h3>
              <p className="text-gray-600">{getFullName()}</p>
              <p className="text-sm text-gray-500">{operator.email}</p>
              <p className="text-sm text-gray-500">{operator.department} - {operator.role}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Training Project</h3>
              <p className="text-gray-600">{project.project_id}</p>
              <p className="text-sm text-gray-500">{project.name}</p>
              {project.description && (
                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <StatusCell progress={progress} />
            </div>
          </div>

          {/* Attempt History */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Attempt History</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Attempt #</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Score</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getAttemptHistory().map((attempt, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm">{attempt.attempt || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm">
                        {attempt.date ? new Date(attempt.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm">{attempt.score ? `${attempt.score}%` : 'N/A'}</td>
                      <td className="px-4 py-2 text-sm capitalize">
                        {attempt.status.replace('_', ' ')}
                      </td>
                    </tr>
                  ))}
                  {getAttemptHistory().length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No attempt history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <ExternalLinkIcon className="w-4 h-4" />
              <span>View Full Training Summary</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <ExternalLinkIcon className="w-4 h-4" />
              <span>View Project Statistics</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
