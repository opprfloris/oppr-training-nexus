
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { TableOfContentsItem } from './TableOfContentsItem';

interface TOCItem {
  id: string;
  title: string;
  level: number;
  number: string;
  hasChildren: boolean;
}

interface TableOfContentsSidebarProps {
  isTocOpen: boolean;
  tableOfContents: TOCItem[];
  collapsedChapters: Set<string>;
  activeSection: string;
  onToggleChapter: (chapterId: string) => void;
  onScrollToSection: (id: string) => void;
  onCloseToc: () => void;
}

export const TableOfContentsSidebar: React.FC<TableOfContentsSidebarProps> = ({
  isTocOpen,
  tableOfContents,
  collapsedChapters,
  activeSection,
  onToggleChapter,
  onScrollToSection,
  onCloseToc
}) => {
  return (
    <div className={`${isTocOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700`}>
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Table of Contents</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseToc}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <nav className="space-y-1">
              {tableOfContents.map((item, index) => (
                <TableOfContentsItem
                  key={item.id}
                  item={item}
                  index={index}
                  tableOfContents={tableOfContents}
                  collapsedChapters={collapsedChapters}
                  activeSection={activeSection}
                  onToggleChapter={onToggleChapter}
                  onScrollToSection={onScrollToSection}
                />
              ))}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
