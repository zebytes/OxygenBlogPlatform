"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface TypingAnimationProps extends MotionProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  repeat?: boolean; // 新增：是否重复播放
  repeatDelay?: number; // 新增：重复播放间隔时间
}

/**
 * 打字机动画组件
 * @param children - 要显示的文本内容
 * @param className - 自定义样式类名
 * @param duration - 每个字符的显示间隔时间（毫秒）
 * @param delay - 动画开始前的延迟时间（毫秒）
 * @param as - 渲染的HTML元素类型
 * @param startOnView - 是否在元素进入视口时开始动画
 * @param repeat - 是否重复播放动画
 * @param repeatDelay - 重复播放的间隔时间（毫秒）
 */
export function TypingAnimation({
  children,
  className,
  duration = 100,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  repeat = false,
  repeatDelay = 1000,
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器的函数
  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // 重置动画状态
  const resetAnimation = () => {
    setDisplayedText("\u00A0"); // 使用不间断空格而不是空字符串
    setIsCompleted(false);
  };

  // 启动打字动画
  const startTyping = () => {
    let i = 0;
    // 如果当前显示的是占位符，从空字符串开始
    if (displayedText === "\u00A0") {
      setDisplayedText("");
    }
    
    intervalRef.current = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsCompleted(true);
      }
    }, duration);
  };

  useEffect(() => {
    if (!startOnView) {
      timeoutRef.current = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimers();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            setStarted(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [delay, startOnView]);

  useEffect(() => {
    if (!started) return;

    startTyping();

    return () => {
      clearTimers();
    };
  }, [children, duration, started]);

  // 处理重复播放逻辑
  useEffect(() => {
    if (!repeat || !isCompleted) return;

    timeoutRef.current = setTimeout(() => {
      resetAnimation();
      // 重新开始动画
      setTimeout(() => {
        startTyping();
      }, 50); // 短暂延迟确保状态重置完成
    }, repeatDelay);

    return () => clearTimers();
  }, [isCompleted, repeat, repeatDelay]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        "text-4xl font-bold leading-[5rem] tracking-[-0.02em]",
        "min-h-[5rem]", // 保险起见，仍然添加最小高度
        className,
      )}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  );
}
