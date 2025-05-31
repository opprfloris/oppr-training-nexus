import { useState } from 'react';
import { toast } from 'sonner';
import { useSkillsMatrix } from '@/hooks/useSkillsMatrix';
import { skillsMatrixService, SkillsMatrixFilters, SkillsMatrixOperator, SkillsMatrixTrainingProject, SkillsMatrixProgress } from '@/services/skillsMatrixService';
import { SkillsMatrixFilters as FiltersComponent } from '@/components/desktop/skills-matrix/SkillsMatrixFilters';
import { SkillsMatrixTable } from '@/components/desktop/skills-matrix/SkillsMatrixTable';
import { SkillsMatrixPagination } from '@/components/desktop/skills-matrix/SkillsMatrixPagination';
import { CellDetailModal } from '@/components/desktop/skills-matrix/CellDetailModal';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import { useBreadcrumbSetter } from '@/hooks/useBreadcrumbSetter';

const SkillsMatrix = () => {
  // Set breadcrumbs for skills matrix
  useBreadcrumbSetter([
    { label: 'Skills Matrix', isCurrentPage: true }
  ]);

  const [filters, setFilters] = useState<SkillsMatrixFilters>({});
  const [selectedCell, setSelectedCell] = useState<{
    operator: SkillsMatrixOperator;
    project: SkillsMatrixTrainingProject;
    progress?: SkillsMatrixProgress;
  } | null>(null);

  const {
    operators,
    allOperators,
    trainingProjects,
    progressData,
    departments,
    isLoading,
    error,
    pagination
  } = useSkillsMatrix(filters);

  const handleCellClick = (operator: SkillsMatrixOperator, project: SkillsMatrixTrainingProject, progress?: SkillsMatrixProgress) => {
    setSelectedCell({ operator, project, progress });
  };

  const handleExport = async () => {
    try {
      const csvData = await skillsMatrixService.exportMatrixData(allOperators, trainingProjects, progressData);
      
      // Convert to CSV string
      if (csvData.length === 0) {
        toast.error('No data to export');
        return;
      }

      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes in CSV
            return value.toString().includes(',') || value.toString().includes('"') 
              ? `"${value.toString().replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `skills-matrix-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Skills matrix exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export skills matrix');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <TableCellsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Skills Matrix</h3>
          <p className="text-gray-600">Failed to load skills matrix data. Please try again.</p>
        </div>
      </div>
    );
  }

  const hasData = operators.length > 0 && trainingProjects.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Matrix</h1>
          <p className="text-gray-600">Track operator competencies and training progress across all skills</p>
        </div>
      </div>

      {/* Filters */}
      <FiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
        trainingProjects={trainingProjects}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oppr-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading skills matrix...</p>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <TableCellsIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Matrix Data Available</h3>
              <p className="text-gray-600">No skills matrix data available for the current selection.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SkillsMatrixTable
              operators={operators}
              trainingProjects={trainingProjects}
              progressData={progressData}
              onCellClick={handleCellClick}
            />
            
            <SkillsMatrixPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
              onPageChange={pagination.setPage}
            />
          </div>
        )}
      </div>

      {/* Cell Detail Modal */}
      <CellDetailModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        operator={selectedCell?.operator || null}
        project={selectedCell?.project || null}
        progress={selectedCell?.progress || undefined}
      />
    </div>
  );
};

export default SkillsMatrix;
