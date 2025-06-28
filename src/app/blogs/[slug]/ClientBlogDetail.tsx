'use client';

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
                     code({ node: _node, inline, className, children, ...props }: {
                       node?: any;
                       inline?: boolean;
                       className?: string;
                       children?: React.ReactNode;
                       [key: string]: any;
                     }) {
                       const match = /language-(\w+)/.exec(className || '');
                       const language = match ? match[1] : '';
                       
                       if (!inline && language) {
                         return (
                           <div className="relative group">
                             <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-gray-300 px-4 py-2 text-sm rounded-t-lg">
                               <span className="font-medium">{language}</span>
                               <button
                                 onClick={() => {
                                   navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                 }}
                                 className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                                 title="复制代码"
                               >
                                 复制
                               </button>
                             </div>
                             <SyntaxHighlighter
                               style={oneDark}
                               language={language}
                               PreTag="div"
                               customStyle={{
                                 margin: 0,
                                 borderTopLeftRadius: 0,
                                 borderTopRightRadius: 0,
                                 borderBottomLeftRadius: '0.5rem',
                                 borderBottomRightRadius: '0.5rem'
                               }}
                             >
                               {String(children).replace(/\n$/, '')}
                             </SyntaxHighlighter>
                           </div>
                         );
                       }
                       
                       return (
                         <code className={className} {...props}>
                           {children}
                         </code>
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
                     a({ href, children }: any) {
                       return (
                         <a 
                           href={href}
                           className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors"
                           target={href?.startsWith('http') ? '_blank' : '_self'}
                           rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                         >
                           {children}
                         </a>
                       );
                     },
                     p({ children }: any) {
                       return (
                         <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300">
                           {children}
                         </p>
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