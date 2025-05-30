
import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
  number: string;
  hasChildren: boolean;
}

export const useTableOfContents = (markdownContent: string) => {
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([]);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());

  const extractTableOfContents = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: TOCItem[] = [];
    let match;
    
    // First pass: collect all headings
    const headings: Array<{ title: string; level: number; id: string }> = [];
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      headings.push({ title, level, id });
    }

    // Second pass: add numbering and determine children
    const counters = [0, 0, 0, 0, 0, 0]; // For levels 1-6
    
    headings.forEach((heading, index) => {
      const level = heading.level;
      
      // Reset deeper level counters
      for (let i = level; i < counters.length; i++) {
        if (i === level - 1) {
          counters[i]++;
        } else {
          counters[i] = 0;
        }
      }
      
      // Create number string
      const number = counters.slice(0, level).filter(c => c > 0).join('.');
      
      // Check if this heading has children (next heading has higher level)
      const hasChildren = index < headings.length - 1 && headings[index + 1].level > level;
      
      toc.push({
        id: heading.id,
        title: heading.title,
        level,
        number,
        hasChildren
      });
    });

    setTableOfContents(toc);
    
    // Initially collapse ALL chapters with children (levels 1, 2, and 3)
    const chaptersToCollapse = toc.filter(item => item.hasChildren && item.level <= 3);
    setCollapsedChapters(new Set(chaptersToCollapse.map(chapter => chapter.id)));
  };

  const toggleChapter = (chapterId: string) => {
    setCollapsedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (markdownContent) {
      extractTableOfContents(markdownContent);
    }
  }, [markdownContent]);

  return {
    tableOfContents,
    collapsedChapters,
    toggleChapter
  };
};
