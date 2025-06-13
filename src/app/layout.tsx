import type { Metadata } from "next";
// 从 Google Fonts 导入 Geist 字体系列
// Geist: 现代无衬线字体，适合正文和标题
// Geist_Mono: 等宽字体，适合代码显示
import { Geist, Geist_Mono } from "next/font/google";
import "../css/globals.css";
import "../css/style.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeScript } from "./components/ThemeScript";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// 配置 Geist 无衬线字体
const geistSans = Geist({
  variable: "--font-geist-sans", // 定义 CSS 变量名，可在样式中使用
  subsets: ["latin"], // 只加载拉丁字符子集，减少字体文件大小
});

// 配置 Geist 等宽字体
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // 定义 CSS 变量名，用于代码块等场景
  subsets: ["latin"], // 只加载拉丁字符子集
});

export const metadata: Metadata = {
  title: "我的博客",
  description: "一个支持主题切换的现代博客",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>

      {/* 应用字体变量到 body 元素：
          - geistSans.variable: 添加 --font-geist-sans CSS 变量
          - geistMono.variable: 添加 --font-geist-mono CSS 变量  
          - antialiased: Tailwind 类，启用字体抗锯齿，让文字更清晰 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
