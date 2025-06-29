import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ClientBlogDetail } from '@/app/blogs//[slug]/ClientBlogDetail';
import 'highlight.js/styles/github-dark.css';
import Link from 'next/link';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
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

// 定义 gray-matter 返回的 data 类型
interface BlogFrontMatter {
  title?: string;
  date?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  excerpt?: string;
  [key: string]: any; // 允许其他未知属性
}

async function getBlogContent(slug: string): Promise<BlogPost | null> {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    // 首先尝试文件夹形式
    const folderPath = path.join(contentDir, slug);
    const indexPath = path.join(folderPath, 'index.md');
    
    let filePath: string;
    let assetsPath: string | null = null;
    
    if (fs.existsSync(indexPath)) {
      // 文件夹形式
      filePath = indexPath;
      assetsPath = path.join(folderPath, 'assets');
    } else {
      // 兼容原有的 .md 文件形式
      filePath = path.join(contentDir, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    let { data, content } = matter(fileContent);
    
    // 类型断言，确保 data 符合 BlogFrontMatter 接口
    const frontMatter = data as BlogFrontMatter;
    
    // 如果有 assets 文件夹，处理图片路径
    if (assetsPath && fs.existsSync(assetsPath)) {
      // 将相对路径的图片替换为正确的路径
      content = content.replace(
        /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
        (match, alt, src: string) => {
          // 移除开头的 ./ 或 /
          const cleanSrc: string = src.replace(/^\.?\//,  '');
          return `![${alt}](/api/blog-assets/${slug}/${cleanSrc})`;
        }
      );
    }
    
    return {
      title: frontMatter.title || '无标题',
      date: frontMatter.date || '2024-01-01',
      category: frontMatter.category || '其他',
      tags: frontMatter.tags || [],
      readTime: frontMatter.readTime || 5,
      excerpt: frontMatter.excerpt || '',
      content: content
    };
  } catch (error) {
    console.error('Error reading blog content:', error);
    return null;
  }
}

/**
 * 博客详情页面组件（服务端组件）
 * 
 * 功能特点：
 * - 支持动态路由，根据 slug 参数显示对应的博客文章
 * - 在服务端读取 Markdown 文件内容
 * - 将数据传递给客户端组件进行渲染
 * 
 * @param params - 包含 slug 参数的对象
 * @returns 渲染的博客详情页面
 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // 在服务端获取博客内容
  const resolvedParams = await params;
  const blogData = await getBlogContent(resolvedParams.slug);
  
  if (!blogData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章未找到</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的文章不存在。</p>
          <Link
            href="/blogs" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }
  
  return <ClientBlogDetail blog={blogData} />;
}