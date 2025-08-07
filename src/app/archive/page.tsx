import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { formatBlogDate } from '@/lib/utils';
import ClientArchivePage from '@/components/archive/ClientArchivePage';

/**
 * 博客文章接口
 */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  readTime: number;
  year: number; // 添加年份字段用于归档
}

/**
 * 博客前置元数据接口
 */
interface BlogFrontMatter {
  title?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
}

/**
 * 递归扫描目录中的所有 .md 文件
 * 
 * @param dir - 要扫描的目录路径
 * @param baseDir - 基础目录路径，用于计算相对路径
 * @returns 包含所有 .md 文件信息的数组
 */
function scanMarkdownFiles(dir: string, baseDir: string): Array<{filePath: string, relativePath: string, slug: string}> {
  const results: Array<{filePath: string, relativePath: string, slug: string}> = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        results.push(...scanMarkdownFiles(itemPath, baseDir));
      } else if (item.endsWith('.md')) {
        // 找到 .md 文件
        const relativePath = path.relative(baseDir, itemPath);
        // 生成 slug：使用相对路径，去除 .md 扩展名，将路径分隔符替换为连字符
        const slug = relativePath.replace(/\.md$/, '').replace(/[\/\\]/g, '-');
        
        results.push({
          filePath: itemPath,
          relativePath,
          slug
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
  
  return results;
}

/**
 * 获取所有博客文章并按年份归档
 * 
 * @returns 按年份归档的博客文章
 */
function getArchivedBlogs(): { [year: number]: BlogPost[] } {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    if (!fs.existsSync(contentDir)) {
      return {};
    }
    
    // 递归扫描所有 .md 文件
    const markdownFiles = scanMarkdownFiles(contentDir, contentDir);
    const blogPosts: BlogPost[] = [];
    
    markdownFiles.forEach(({ filePath, relativePath, slug }) => {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        const frontMatter = data as BlogFrontMatter;
        
        // 标题处理：优先使用元数据中的 title，否则使用文件名
        const fileName = path.basename(filePath, '.md');
        const title = frontMatter.title || fileName;
        
        // 解析日期，获取年份
        const dateStr = frontMatter.date || '';
        const date = dateStr ? new Date(dateStr) : new Date();
        const year = date.getFullYear();
        
        blogPosts.push({
          id: slug,
          title: title,
          excerpt: frontMatter.excerpt || '',
          date: formatBlogDate(frontMatter.date),
          category: frontMatter.category || '其他',
          tags: frontMatter.tags || [],
          slug: slug,
          readTime: frontMatter.readTime || 5,
          year: year
        });
      } catch (error) {
        console.error(`Error reading blog file ${relativePath}:`, error);
      }
    });
    
    // 按日期排序（最新的在前）
    const sortedPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 按年份归档
    const archivedPosts: { [year: number]: BlogPost[] } = {};
    
    sortedPosts.forEach(post => {
      if (!archivedPosts[post.year]) {
        archivedPosts[post.year] = [];
      }
      archivedPosts[post.year].push(post);
    });
    
    return archivedPosts;
  } catch (error) {
    console.error('Error getting archived blogs:', error);
    return {};
  }
}

/**
 * 归档页面组件
 * 获取按年份归档的博客文章数据
 */
export default async function ArchivePage() {
  // 获取归档博客数据
  const archivedPosts = getArchivedBlogs();
  
  return <ClientArchivePage archivedPosts={archivedPosts} />;
}