'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'system';

// 主题上下文类型
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // 实际应用的主题（system会解析为light或dark）
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题Provider组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // 获取系统主题偏好
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  // 解析实际应用的主题
  const resolveTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, []);

  // 应用主题到DOM
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // 初始化主题（在客户端挂载后执行）
  useEffect(() => {
    setMounted(true);

    // 从localStorage读取保存的主题设置
    const savedTheme = localStorage.getItem('theme') as Theme;

    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
      const newResolvedTheme = resolveTheme(savedTheme);
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    } else {
      // 如果没有保存的主题，使用系统主题
      const systemTheme = getSystemTheme();

      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, [resolveTheme]);

  // 监听主题变化（仅在挂载后执行）
  useEffect(() => {
    if (!mounted) return;

    const newResolvedTheme = resolveTheme(theme);

    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);

    // 保存主题设置到localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted, resolveTheme]);

  // 监听系统主题变化（仅当选择system时且已挂载）
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newResolvedTheme = resolveTheme(theme);
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, resolveTheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// 使用主题的Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
