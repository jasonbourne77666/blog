import Header from '@/app/components/Header';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen bg-theme-gradient from-zinc-900 via-zinc-400/10 to-zinc-900 pt-20'>
      <Header />
      <div className='container mx-auto  '>{children}</div>
    </div>
  );
}
