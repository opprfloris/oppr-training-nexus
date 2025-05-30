
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Download, Menu, X } from 'lucide-react';

const Documentation = () => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(true);

  // Table of contents extracted from markdown
  const [tableOfContents, setTableOfContents] = useState<Array<{
    id: string;
    title: string;
    level: number;
  }>>([]);

  useEffect(() => {
    // Load the markdown documentation
    fetch('/TECHNICAL_DOCUMENTATION.md')
      .then(response => response.text())
      .then(content => {
        setMarkdownContent(content);
        extractTableOfContents(content);
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
    if (markdownContent) {
      setTimeout(() => {
        mermaid.run();
      }, 100);
    }
  }, [markdownContent]);

  const extractTableOfContents = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: Array<{ id: string; title: string; level: number }> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      toc.push({ id, title, level });
    }

    setTableOfContents(toc);
  };

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

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language === 'mermaid') {
        return (
          <div className="mermaid my-4">
            {String(children).replace(/\n$/, '')}
          </div>
        );
      }

      return !inline && match ? (
        <pre className="bg-gray-900 text-gray-100 rounded-md my-4 p-4 overflow-x-auto">
          <code className={`language-${language}`} {...props}>
            {String(children).replace(/\n$/, '')}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return <h1 id={id} className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return <h2 id={id} className="text-3xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return <h3 id={id} className="text-2xl font-medium mt-5 mb-2 text-gray-700 dark:text-gray-300" {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return <h4 id={id} className="text-xl font-medium mt-4 mb-2 text-gray-600 dark:text-gray-400" {...props}>{children}</h4>;
    },
    p: ({ children, ...props }: any) => (
      <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="mb-4 ml-6 list-disc text-gray-600 dark:text-gray-300" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="mb-4 ml-6 list-decimal text-gray-600 dark:text-gray-300" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>{children}</li>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300 dark:border-gray-600" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
        {children}
      </td>
    ),
  };

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
      {/* Table of Contents Sidebar */}
      <div className={`${isTocOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700`}>
        <Card className="h-full rounded-none border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Table of Contents</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTocOpen(false)}
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
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      item.level === 1 ? 'font-semibold text-gray-900 dark:text-gray-100' :
                      item.level === 2 ? 'ml-4 font-medium text-gray-700 dark:text-gray-300' :
                      'ml-8 text-gray-600 dark:text-gray-400'
                    } ${activeSection === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : ''}`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isTocOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTocOpen(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Technical Documentation
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                components={components}
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
