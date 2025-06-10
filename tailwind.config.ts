import type { Config } from "tailwindcss";

const config: Config = {
  // 指定要扫描的文件
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 深色模式配置：只使用类名策略，不使用媒体查询
  darkMode: "class",
  theme: {
    extend: {
      // 在这里可以扩展主题配置
    },
  },
  plugins: [],
};

export default config;
