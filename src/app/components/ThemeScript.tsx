// 主题预设脚本组件
// 这个脚本会在页面加载前执行，防止主题闪烁
export function ThemeScript() {
  const script = `
    (function() {
      try {
        // 获取保存的主题设置
        const savedTheme = localStorage.getItem('theme');
        
        // 获取系统主题偏好
        const getSystemTheme = () => {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };
        
        // 解析实际应用的主题
        const resolveTheme = (theme) => {
          if (theme === 'system' || !theme) {
            return getSystemTheme();
          }
          return theme;
        };
        
        // 应用主题
        const applyTheme = (resolvedTheme) => {
          const root = document.documentElement;
          if (resolvedTheme === 'dark') {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        };
        
        // 立即应用主题（仅在没有设置时）
        if (!document.documentElement.classList.contains('dark')) {
          const theme = savedTheme || 'system';
          const resolvedTheme = resolveTheme(theme);
          applyTheme(resolvedTheme);
        }
        
      } catch (error) {
        // 如果出错，默认使用浅色主题
        console.warn('Theme script error:', error);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
