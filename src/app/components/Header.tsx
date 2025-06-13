import { ThemeToggle, ThemeToggleSimple } from './ThemeToggle';
import Link from 'next/link';

interface HeaderProps {
  headerBg?: boolean;
}

export default function Header({ headerBg }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        headerBg ? 'bg-background' : ''
      }`}
    >
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-card-foreground'>我的博客</h1>
        </Link>
        <div className='flex items-center gap-4'>
          {/* 完整版主题切换器 */}
          <ThemeToggle />
          {/* 简化版主题切换器 */}
          <ThemeToggleSimple />
        </div>
      </div>
    </header>
  );
}
