
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
  number: string;
  hasChildren: boolean;
}

interface TableOfContentsItemProps {
  item: TOCItem;
  index: number;
  tableOfContents: TOCItem[];
  collapsedChapters: Set<string>;
  activeSection: string;
  onToggleChapter: (chapterId: string) => void;
  onScrollToSection: (id: string) => void;
}

export const TableOfContentsItem: React.FC<TableOfContentsItemProps> = ({
  item,
  index,
  tableOfContents,
  collapsedChapters,
  activeSection,
  onToggleChapter,
  onScrollToSection
}) => {
  const isCollapsed = collapsedChapters.has(item.id);
  const isParent = item.hasChildren;
  
  // Check if this item should be hidden (it's a child of a collapsed parent)
  if (item.level > 1) {
    // Find the closest parent at a higher level
    for (let i = index - 1; i >= 0; i--) {
      const potentialParent = tableOfContents[i];
      if (potentialParent.level < item.level) {
        // Check if any parent in the chain is collapsed
        let currentLevel = item.level;
        for (let j = index - 1; j >= 0; j--) {
          const ancestor = tableOfContents[j];
          if (ancestor.level < currentLevel) {
            if (collapsedChapters.has(ancestor.id)) {
              return null; // Hide this item
            }
            currentLevel = ancestor.level;
            if (currentLevel === 1) break;
          }
        }
        break;
      }
    }
  }

  // Consistent styling based on level
  const getItemStyles = () => {
    const baseStyles = "flex-1 text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
    const activeStyles = activeSection === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : '';
    
    switch (item.level) {
      case 1:
        return `${baseStyles} font-semibold text-gray-900 dark:text-gray-100 ${activeStyles}`;
      case 2:
        return `${baseStyles} font-medium text-gray-700 dark:text-gray-300 ${activeStyles}`;
      case 3:
        return `${baseStyles} font-normal text-gray-600 dark:text-gray-400 ${activeStyles}`;
      default:
        return `${baseStyles} font-normal text-gray-500 dark:text-gray-500 ${activeStyles}`;
    }
  };

  const getIndentation = () => {
    if (isParent) return '0';
    return `${(item.level - 1) * 1.5 + 1.75}rem`;
  };

  return (
    <div>
      <div className="flex items-center">
        {isParent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleChapter(item.id)}
            className="p-0 h-6 w-6 mr-1 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
        )}
        <button
          onClick={() => onScrollToSection(item.id)}
          className={getItemStyles()}
          style={{ 
            marginLeft: getIndentation()
          }}
        >
          <span className="font-mono text-xs mr-2 opacity-70 text-blue-600 dark:text-blue-400">
            {item.number}
          </span>
          {item.title}
        </button>
      </div>
    </div>
  );
};
