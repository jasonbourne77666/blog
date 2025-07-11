export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative min-h-screen bg-theme-gradient from-zinc-900 via-zinc-400/10 to-zinc-900 '>
      {children}
    </div>
  );
}
