'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import 'katex/dist/katex.min.css';

interface ComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface BlogPost {
  title: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  content: string;
}

interface ClientBlogDetailProps {
  blog: BlogPost;
}

interface LinkProps {
  href?: string;
  children?: React.ReactNode;
}
/**
 * 博客详情客户端组件
 * 
 * 功能特点：
 * - 使用 framer-motion 提供动画效果
 * - 使用 ReactMarkdown 渲染 Markdown 格式的文章内容
 * - 支持语法高亮显示代码块
 * - 包含返回博客列表的导航链接
 * - 响应式设计，适配不同屏幕尺寸
 * - 支持深色模式
 * 
 * @param blog - 博客文章数据
 * @returns 渲染的博客详情页面
 */
export function ClientBlogDetail({ blog }: ClientBlogDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/blogs" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
          >
            ← 返回博客列表
          </Link>
          
          {/* 文章头部信息 */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{blog.date}</span>
              <span>•</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {blog.category}
              </span>
              <span>•</span>
              <span>预计阅读时间{blog.readTime}分钟</span>
            </div>
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          
          {/* 文章内容 */}
          <motion.article 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[
                    remarkGfm,
                    remarkMath,
                    remarkBreaks,
                    remarkEmoji
                  ]}
                  rehypePlugins={[
                    rehypeKatex,
                    rehypeRaw,
                    rehypeSlug
                  ]}
                  components={{
                     p({ children, ...props }: ComponentProps) {
                       return (
                         <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
                           {children}
                         </p>
                       );
                     },
                     pre: ({ children, ...props }: ComponentProps) => (
                       <pre {...props} className="relative group my-6 bg-gray-800 dark:bg-gray-900 rounded-lg text-sm p-0 overflow-hidden">
                         {children}
                       </pre>
                     ),
                     code({ inline, className, children, ...props }: {
                       inline?: boolean;
                       className?: string;
                       children?: React.ReactNode;
                       [key: string]: any;
                     }) {
                       // 提取纯文本内容，避免复杂的React元素结构
                        const getTextContent = (node: React.ReactNode): string => {
                          if (typeof node === 'string') return node;
                          if (typeof node === 'number') return String(node);
                          if (Array.isArray(node)) return node.map(getTextContent).join('');
                          if (node && typeof node === 'object' && 'props' in node) {
                            const reactElement = node as React.ReactElement<{ children?: React.ReactNode }>;
                            return getTextContent(reactElement.props.children);
                          }
                          return '';
                        };

                       const textContent = getTextContent(children);
                       const match = /language-(\w+)/.exec(className || '');
                       const language = match ? match[1] : 'text';
                       const codeContent = textContent.replace(/\n$/, '');

                       // 智能判断行内代码：
                       // 1. 明确标记为inline的
                       // 2. 没有语言类名、内容简短且不包含换行符的（真正的行内代码）
                       // 3. 排除无语言代码块：即使没有className，如果内容包含换行符或来自pre标签，则为块级代码
                       const hasLanguageClass = className && className.startsWith('language-');
                       const isShortContent = codeContent.length < 100 && !codeContent.includes('\n');
                       const isInlineCode = inline || (!hasLanguageClass && !className && isShortContent);

                       // 行内代码：只渲染纯文本，不包含任何块级元素
                       if (isInlineCode) {
                         return (
                           <code 
                             className="font-mono text-sm bg-gray-50 dark:bg-gray-800/50 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-sm inline" 
                             {...props}
                           >
                             {textContent}
                           </code>
                         );
                       }

                       // 块级代码：包含语法高亮和UI元素
                       return (
                         <div className="relative">
                           {/* 代码块头部 - 包含语言标签和复制按钮 */}
                           <div className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
                             <span className="text-xs text-gray-300 font-medium select-none">
                               {language || 'text'}
                             </span>
                             <button
                               onClick={() => navigator.clipboard.writeText(codeContent)}
                               className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 p-1.5 rounded-md transition-colors duration-200"
                               title="复制代码"
                             >
                               <ClipboardIcon className="w-4 h-4" />
                             </button>
                           </div>
                           <SyntaxHighlighter
                             style={oneDark}
                             language={language}
                             PreTag="code"
                             customStyle={{
                               margin: 0,
                               padding: '1.25rem',
                               backgroundColor: 'transparent',
                               borderRadius: '0 0 0.5rem 0.5rem',
                               fontSize: '0.875rem',
                               display: 'block',
                             }}
                             codeTagProps={{
                               style: {
                                 fontFamily: 'var(--font-mono)',
                               },
                             }}
                           >
                             {codeContent}
                           </SyntaxHighlighter>
                         </div>
                       );
                     },
                    blockquote({ children }: ComponentProps) {
                       return (
                         <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 my-4 rounded-r-lg">
                           <div className="flex items-start">
                             <div className="text-blue-500 mr-2 text-lg">💡</div>
                             <div className="flex-1">{children}</div>
                           </div>
                         </blockquote>
                       );
                     },
                     table({ children }: ComponentProps) {
                       return (
                         <div className="overflow-x-auto my-6">
                           <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg">
                             {children}
                           </table>
                         </div>
                       );
                     },
                     thead({ children }: ComponentProps) {
                       return (
                         <thead className="bg-gray-50 dark:bg-gray-800">
                           {children}
                         </thead>
                       );
                     },
                     tbody({ children }: ComponentProps) {
                       return (
                         <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                           {children}
                         </tbody>
                       );
                     },
                     tr({ children }: ComponentProps) {
                       return (
                         <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                           {children}
                         </tr>
                       );
                     },
                     th({ children }: ComponentProps) {
                       return (
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                           {children}
                         </th>
                       );
                     },
                     td({ children }: ComponentProps) {
                        return (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                            {children}
                          </td>
                        );
                      },
                      h1({ children }: ComponentProps) {
                       return (
                         <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h1>
                       );
                     },
                     h2({ children }: ComponentProps) {
                       return (
                         <h2 className="text-2xl font-semibold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h2>
                       );
                     },
                     h3({ children }: any) {
                       return (
                         <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h3>
                       );
                     },
                     h4({ children }: any) {
                       return (
                         <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h4>
                       );
                     },
                     h5({ children }: any) {
                       return (
                         <h5 className="text-base font-semibold mt-3 mb-2 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h5>
                       );
                     },
                     h6({ children }: any) {
                       return (
                         <h6 className="text-sm font-semibold mt-3 mb-2 text-gray-900 dark:text-white no-underline">
                           {children}
                         </h6>
                       );
                     },
                     ol({ children }: any) {
                       return (
                         <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">
                           {children}
                         </ol>
                       );
                     },
                     ul({ children }: any) {
                       return (
                         <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-gray-700 dark:text-gray-300">
                           {children}
                         </ul>
                       );
                     },
                     li({ children }: any) {
                       return (
                         <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                           {children}
                         </li>
                       );
                     },
                     a({ href, children }: LinkProps) {
                       return (
                         <a 
                           href={href as string}
                           className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors"
                           target={href?.startsWith('http') ? '_blank' : '_self'}
                           rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                         >
                           {children}
                         </a>
                       );
                     }
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.article>
          
          {/* 文章底部导航 */}
          <motion.div 
            className="mt-12 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              href="/blogs" 
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← 返回列表
            </Link>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              感谢阅读！
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}