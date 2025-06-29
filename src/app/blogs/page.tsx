import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ClientBlogsPage from './ClientBlogsPage';

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
 * 获取所有博客文章
 */
function getAllBlogs(): BlogPost[] {
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blogs');
    
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    const items = fs.readdirSync(contentDir);
    const blogPosts: BlogPost[] = [];
    
    items.forEach(item => {
      const itemPath = path.join(contentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // 文件夹形式：查找 index.md
        const indexPath = path.join(itemPath, 'index.md');
        if (fs.existsSync(indexPath)) {
          try {
            const fileContent = fs.readFileSync(indexPath, 'utf8');
            const { data } = matter(fileContent);
            const frontMatter = data as BlogFrontMatter;
            
            blogPosts.push({
              id: item,
              title: frontMatter.title || '无标题',
              excerpt: frontMatter.excerpt || '',
              date: frontMatter.date || '2024-01-01',
              category: frontMatter.category || '其他',
              tags: frontMatter.tags || [],
              slug: item,
              readTime: frontMatter.readTime || 5
            });
          } catch (error) {
            console.error(`Error reading blog folder ${item}:`, error);
          }
        }
      } else if (item.endsWith('.md')) {
        // 兼容原有的 .md 文件形式
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data } = matter(fileContent);
          const frontMatter = data as BlogFrontMatter;
          
          const slug = item.replace('.md', '');
          
          blogPosts.push({
            id: slug,
            title: frontMatter.title || '无标题',
            excerpt: frontMatter.excerpt || '',
            date: frontMatter.date || '2024-01-01',
            category: frontMatter.category || '其他',
            tags: frontMatter.tags || [],
            slug: slug,
            readTime: frontMatter.readTime || 5
          });
        } catch (error) {
          console.error(`Error reading blog file ${item}:`, error);
        }
      }
    });
    
    // 按日期排序（最新的在前）
    return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting all blogs:', error);
    return [];
  }
}

/**
 * 博客列表页面（服务端组件）
 * 获取博客数据并传递给客户端组件
 */
export default async function BlogsPage() {
  // 获取博客数据
  const blogPosts = getAllBlogs();
  
  return <ClientBlogsPage initialPosts={blogPosts} />;
}