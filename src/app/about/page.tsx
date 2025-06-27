/**
 * 关于页面
 * 展示个人信息和博客介绍
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-600">👨‍💻</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              关于我
            </h1>
            <p className="text-lg text-gray-600">
              全栈开发者 | 技术爱好者 | 终身学习者
            </p>
          </div>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                个人简介
              </h2>
              <p className="text-gray-700 leading-relaxed">
                我是一名热爱技术的全栈开发者，专注于现代 Web 开发技术。
                拥有丰富的前端和后端开发经验，熟悉 React、Next.js、Node.js 等技术栈。
                喜欢探索新技术，分享开发经验，致力于构建优秀的用户体验。
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                技术栈
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="text-blue-800 font-medium">React</span>
                </div>
                <div className="bg-black p-3 rounded-lg text-center">
                  <span className="text-white font-medium">Next.js</span>
                </div>
                <div className="bg-blue-600 p-3 rounded-lg text-center">
                  <span className="text-white font-medium">TypeScript</span>
                </div>
                <div className="bg-green-500 p-3 rounded-lg text-center">
                  <span className="text-white font-medium">Node.js</span>
                </div>
                <div className="bg-cyan-500 p-3 rounded-lg text-center">
                  <span className="text-white font-medium">Tailwind CSS</span>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg text-center">
                  <span className="text-white font-medium">Git</span>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                关于这个博客
              </h2>
              <p className="text-gray-700 leading-relaxed">
                这个博客是我分享技术见解、开发经验和生活感悟的地方。
                我会定期更新关于前端开发、后端技术、工具使用等方面的文章。
                希望这些内容能够对你有所帮助，也欢迎与我交流讨论。
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                联系方式
              </h2>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:your.email@example.com" 
                   className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  📧 邮箱
                </a>
                <a href="https://github.com/yourusername" 
                   className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                  🐙 GitHub
                </a>
                <a href="https://twitter.com/yourusername" 
                   className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  🐦 Twitter
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}