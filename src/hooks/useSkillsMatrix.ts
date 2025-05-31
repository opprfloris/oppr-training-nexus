
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skillsMatrixService, SkillsMatrixFilters, SkillsMatrixOperator, SkillsMatrixTrainingProject, SkillsMatrixProgress } from '@/services/skillsMatrixService';

export const useSkillsMatrix = (filters: SkillsMatrixFilters = {}) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch operators
  const { 
    data: operators = [], 
    isLoading: operatorsLoading,
    error: operatorsError
  } = useQuery({
    queryKey: ['skills-matrix-operators', filters.department, filters.role, filters.search],
    queryFn: () => skillsMatrixService.getOperators(filters)
  });

  // Fetch training projects
  const { 
    data: trainingProjects = [], 
    isLoading: projectsLoading,
    error: projectsError
  } = useQuery({
    queryKey: ['skills-matrix-projects', filters.trainingProject],
    queryFn: () => skillsMatrixService.getTrainingProjects(filters)
  });

  // Fetch departments for filter dropdown
  const { 
    data: departments = [],
    isLoading: departmentsLoading
  } = useQuery({
    queryKey: ['skills-matrix-departments'],
    queryFn: () => skillsMatrixService.getDepartments()
  });

  // Fetch progress data
  const operatorIds = operators.map(op => op.id);
  const projectIds = trainingProjects.map(proj => proj.id);
  
  const { 
    data: progressData = [], 
    isLoading: progressLoading,
    error: progressError
  } = useQuery({
    queryKey: ['skills-matrix-progress', operatorIds, projectIds, filters.status],
    queryFn: () => skillsMatrixService.getOperatorProgress(operatorIds, projectIds, filters.status),
    enabled: operatorIds.length > 0 && projectIds.length > 0
  });

  // Pagination
  const totalPages = Math.ceil(operators.length / pageSize);
  const paginatedOperators = operators.slice((page - 1) * pageSize, page * pageSize);

  const isLoading = operatorsLoading || projectsLoading || progressLoading || departmentsLoading;
  const error = operatorsError || projectsError || progressError;

  return {
    operators: paginatedOperators,
    allOperators: operators,
    trainingProjects,
    progressData,
    departments,
    isLoading,
    error,
    pagination: {
      page,
      totalPages,
      pageSize,
      setPage,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    }
  };
};
