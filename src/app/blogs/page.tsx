/**
 * 博客列表页面
 * 展示所有博客文章的列表
 */
export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-65">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            博客文章
          </h1>
          <p className="text-lg text-gray-600">
            分享技术见解与生活感悟
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 示例博客卡片 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Next.js 15 新特性解析
              </h2>
              <p className="text-gray-600 mb-4">
                深入了解 Next.js 15 带来的新功能和改进...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>2024-01-15</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  技术
                </span>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                React 19 新特性预览
              </h2>
              <p className="text-gray-600 mb-4">
                探索 React 19 即将到来的激动人心的新功能...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>2024-01-10</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  前端
                </span>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                TypeScript 最佳实践
              </h2>
              <p className="text-gray-600 mb-4">
                分享在实际项目中使用 TypeScript 的经验和技巧...
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>2024-01-05</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  开发
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}