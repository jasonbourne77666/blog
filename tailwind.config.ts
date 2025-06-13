import type { Config } from 'tailwindcss';

const config: Config = {
  // Tailwind v4 不再需要 content 配置，它会自动扫描
  // 深色模式配置：在 v4 中通过 CSS 配置
  theme: {
    extend: {
      // 在这里可以扩展主题配置
    },
  },
  plugins: [],
};

export default config;
