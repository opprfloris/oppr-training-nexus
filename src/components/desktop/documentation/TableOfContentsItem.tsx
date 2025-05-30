
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
    // Find parent chapter
    for (let i = index - 1; i >= 0; i--) {
      const potentialParent = tableOfContents[i];
      if (potentialParent.level < item.level) {
        if (collapsedChapters.has(potentialParent.id)) {
          return null; // Hide this item
        }
        break;
      }
    }
  }

  return (
    <div>
      <div className="flex items-center">
        {isParent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleChapter(item.id)}
            className="p-0 h-6 w-6 mr-1"
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
          className={`flex-1 text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            item.level === 1 ? 'font-semibold text-gray-900 dark:text-gray-100' :
            item.level === 2 ? `${isParent ? '' : 'ml-7'} font-medium text-gray-700 dark:text-gray-300` :
            `${isParent ? 'ml-0' : 'ml-7'} text-gray-600 dark:text-gray-400`
          } ${activeSection === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : ''}`}
          style={{ 
            marginLeft: isParent ? '0' : `${(item.level - 1) * 1.5 + 1.75}rem`
          }}
        >
          <span className="font-mono text-xs mr-2 opacity-70">{item.number}</span>
          {item.title}
        </button>
      </div>
    </div>
  );
};
