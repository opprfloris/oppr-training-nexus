
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusCell } from './StatusCell';
import { SkillsMatrixOperator, SkillsMatrixTrainingProject, SkillsMatrixProgress } from '@/services/skillsMatrixService';

interface SkillsMatrixTableProps {
  operators: SkillsMatrixOperator[];
  trainingProjects: SkillsMatrixTrainingProject[];
  progressData: SkillsMatrixProgress[];
  onCellClick?: (operator: SkillsMatrixOperator, project: SkillsMatrixTrainingProject, progress?: SkillsMatrixProgress) => void;
}

export const SkillsMatrixTable = ({
  operators,
  trainingProjects,
  progressData,
  onCellClick
}: SkillsMatrixTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const getProgressForOperatorProject = (operatorId: string, projectId: string) => {
    return progressData.find(p => 
      p.operator_id === operatorId && p.training_project_id === projectId
    );
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  const getFullName = (operator: SkillsMatrixOperator) => {
    return `${operator.first_name || ''} ${operator.last_name || ''}`.trim() || 'Unknown';
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {/* Fixed operator info columns */}
              <TableHead className="sticky left-0 bg-gray-50 border-r border-gray-200 min-w-[60px]">
                Avatar
              </TableHead>
              <TableHead 
                className="sticky left-[60px] bg-gray-50 border-r border-gray-200 min-w-[200px] cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Full Name
                {sortConfig?.key === 'name' && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="sticky left-[260px] bg-gray-50 border-r border-gray-200 min-w-[200px]">
                Email
              </TableHead>
              <TableHead className="sticky left-[460px] bg-gray-50 border-r border-gray-200 min-w-[150px]">
                Department
              </TableHead>
              <TableHead className="sticky left-[610px] bg-gray-50 border-r border-gray-200 min-w-[100px]">
                Role
              </TableHead>

              {/* Dynamic training project columns */}
              {trainingProjects.map(project => (
                <TableHead 
                  key={project.id}
                  className="min-w-[250px] cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(project.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{project.project_id}</span>
                    <span className="text-xs font-normal text-gray-600">{project.name}</span>
                  </div>
                  {sortConfig?.key === project.id && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {operators.map(operator => (
              <TableRow key={operator.id} className="hover:bg-gray-50">
                {/* Fixed operator info cells */}
                <TableCell className="sticky left-0 bg-white border-r border-gray-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={operator.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(operator.first_name, operator.last_name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="sticky left-[60px] bg-white border-r border-gray-200 font-medium">
                  {getFullName(operator)}
                </TableCell>
                <TableCell className="sticky left-[260px] bg-white border-r border-gray-200">
                  {operator.email}
                </TableCell>
                <TableCell className="sticky left-[460px] bg-white border-r border-gray-200">
                  {operator.department || 'N/A'}
                </TableCell>
                <TableCell className="sticky left-[610px] bg-white border-r border-gray-200">
                  {operator.role}
                </TableCell>

                {/* Dynamic training project status cells */}
                {trainingProjects.map(project => {
                  const progress = getProgressForOperatorProject(operator.id, project.id);
                  return (
                    <TableCell key={project.id} className="p-0">
                      <StatusCell 
                        progress={progress}
                        onClick={() => onCellClick?.(operator, project, progress)}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
