
import React from 'react';

export const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    if (language === 'mermaid') {
      return (
        <div className="mermaid my-6 flex justify-center">
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
