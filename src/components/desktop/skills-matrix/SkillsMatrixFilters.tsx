
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SkillsMatrixFilters as Filters, SkillsMatrixTrainingProject } from '@/services/skillsMatrixService';

interface SkillsMatrixFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  departments: string[];
  trainingProjects: SkillsMatrixTrainingProject[];
  onExport: () => void;
  isLoading?: boolean;
}

export const SkillsMatrixFilters = ({
  filters,
  onFiltersChange,
  departments,
  trainingProjects,
  onExport,
  isLoading
}: SkillsMatrixFiltersProps) => {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-4 bg-white border-b border-gray-200">
      {/* Left side - Filters */}
      <div className="flex items-center space-x-4">
        {/* Department Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-gray-700">Filter by Department:</label>
          <Select 
            value={filters.department || 'all'} 
            onValueChange={(value) => updateFilter('department', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-gray-700">Filter by Role:</label>
          <Select 
            value={filters.role || 'all'} 
            onValueChange={(value) => updateFilter('role', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Operator">Operator</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Training Project Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-gray-700">Filter by Training Project:</label>
          <Select 
            value={filters.trainingProject || 'all'} 
            onValueChange={(value) => updateFilter('trainingProject', value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {trainingProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.project_id} - {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-gray-700">Filter by Status:</label>
          <Select 
            value={filters.status || 'all'} 
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right side - Search and Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by Operator Name or Email..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 w-64"
          />
        </div>

        {/* Export Button */}
        <Button 
          variant="outline" 
          onClick={onExport}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>
    </div>
  );
};
