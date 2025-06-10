import { ThemeToggle, ThemeToggleSimple } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-card-foreground">我的博客</h1>
        <div className="flex items-center gap-4">
          {/* 完整版主题切换器 */}
          <ThemeToggle />
          {/* 简化版主题切换器 */}
          <ThemeToggleSimple />
        </div>
      </div>
    </header>
  );
}
