import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TableOfContentsSidebar } from '@/components/desktop/documentation/TableOfContentsSidebar';
import { DocumentationHeader } from '@/components/desktop/documentation/DocumentationHeader';
import { markdownComponents, resetHeadingCounters } from '@/components/desktop/documentation/MarkdownComponents';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { useBreadcrumbSetter } from '@/hooks/useBreadcrumbSetter';

const Documentation = () => {
  // Set breadcrumbs for documentation
  useBreadcrumbSetter([
    { label: 'Documentation', isCurrentPage: true }
  ]);

  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const { tableOfContents, collapsedChapters, toggleChapter } = useTableOfContents(markdownContent);

  useEffect(() => {
    // Load the markdown documentation
    fetch('/TECHNICAL_DOCUMENTATION.md')
      .then(response => response.text())
      .then(content => {
        // Reset heading counters before setting new content
        resetHeadingCounters();
        setMarkdownContent(content);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load documentation:', error);
        setMarkdownContent('# Documentation Not Found\n\nThe technical documentation file could not be loaded.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    // Re-render Mermaid diagrams when content changes
    if (markdownContent && contentRef.current) {
      setTimeout(() => {
        const mermaidElements = contentRef.current?.querySelectorAll('.mermaid');
        if (mermaidElements && mermaidElements.length > 0) {
          mermaidElements.forEach((element, index) => {
            // Clear any existing SVG
            element.innerHTML = element.textContent || '';
            // Add unique ID for mermaid processing
            element.id = `mermaid-${index}`;
          });
          mermaid.run();
        }
      }, 100);
    }
  }, [markdownContent]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredContent = searchTerm
    ? markdownContent
        .split('\n')
        .filter(line => 
          line.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .join('\n')
    : markdownContent;

  // Reset heading counters before rendering filtered content
  useEffect(() => {
    resetHeadingCounters();
  }, [filteredContent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading documentation...</span>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-screen">
      <TableOfContentsSidebar
        isTocOpen={isTocOpen}
        tableOfContents={tableOfContents}
        collapsedChapters={collapsedChapters}
        activeSection={activeSection}
        onToggleChapter={toggleChapter}
        onScrollToSection={scrollToSection}
        onCloseToc={() => setIsTocOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <DocumentationHeader
          isTocOpen={isTocOpen}
          searchTerm={searchTerm}
          onOpenToc={() => setIsTocOpen(true)}
          onSearchChange={setSearchTerm}
          onExportPDF={handleExportPDF}
        />

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto" ref={contentRef}>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {filteredContent}
              </ReactMarkdown>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Documentation;
