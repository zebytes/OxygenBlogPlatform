'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import ThemeToggle from './ThemeToggle';
import { emojy, name } from '@/setting/NavigationSetting';
import { useBackgroundStyle } from '@/hooks/useBackgroundStyle';

/**
 * 导航栏组件
 * 支持响应式设计和主题切换
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { navigationStyle } = useBackgroundStyle('home');

  /**
   * 监听滚动事件，添加滚动效果
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * 检查链接是否为当前页面
   */
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  const navItems = [
    { href: '/', label: '首页' },
    { href: '/blogs', label: '博客' },
    { href: '/about', label: '关于' },
  ];
  
  /**
   * 切换移动端菜单显示状态
   */
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  /**
   * 关闭移动端菜单
   */
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <nav className={navigationStyle.className} style={navigationStyle.style}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{emojy}</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{name}</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-primary dark:text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {/* 主题切换按钮 */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile menu button and theme controls */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary p-2 transition-colors"
              aria-label="切换菜单"
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary dark:text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}