'use client';

import React, { useState } from 'react';
import { useTheme, type Theme } from '../contexts/ThemeContext';

// 主题选项配置
const themeOptions: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: '浅色', icon: '☀️' },
  { value: 'dark', label: '深色', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = themeOptions.find((option) => option.value === theme);

  return (
    <div className='relative'>
      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
        aria-label='切换主题'
      >
        <span className='text-lg'>{currentOption?.icon}</span>
        <span className='text-sm font-medium'>{currentOption?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* 菜单内容 */}
          <div className='absolute top-full left-0 mt-1 w-full min-w-[140px] bg-popover border border-border rounded-lg shadow-lg z-20'>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  theme === option.value
                    ? 'bg-accent text-accent-foreground'
                    : 'text-popover-foreground'
                }`}
              >
                <span className='text-lg'>{option.icon}</span>
                <div className='flex-1'>
                  <div className='text-sm font-medium'>{option.label}</div>
                  {option.value === 'system' && (
                    <div className='text-xs text-muted-foreground'>
                      当前: {resolvedTheme === 'dark' ? '深色' : '浅色'}
                    </div>
                  )}
                </div>
                {theme === option.value && (
                  <svg
                    className='w-4 h-4 text-primary'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 简化版的主题切换按钮（只显示图标）
export function ThemeToggleSimple() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const currentOption = themeOptions.find((option) => option.value === theme);

  return (
    <button
      onClick={handleToggle}
      className='p-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
      aria-label={`当前主题: ${currentOption?.label}，点击切换`}
      title={`当前主题: ${currentOption?.label}`}
    >
      <span className='text-lg'>{currentOption?.icon}</span>
    </button>
  );
}
