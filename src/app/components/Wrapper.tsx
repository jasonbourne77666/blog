import Link from 'next/link';
import { Eye, View } from 'lucide-react';

type Props = {
  blog: {
    slug: string;
    title: string;
    description: string;
    date: string;
  };
  views: number;
};

export const Wrapper: React.FC<Props> = ({ blog, views }) => {
  return (
    <Link href={`${blog.slug}`}>
      <article className='h-full p-4 md:p-8'>
        <div className='flex justify-between gap-2 items-center'>
          <span className='text-xs text-card-foreground duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange'>
            {blog.date ? (
              <time
                className='text-card-foreground'
                dateTime={new Date(blog.date).toISOString()}
              >
                {Intl.DateTimeFormat(undefined, {
                  dateStyle: 'medium',
                }).format(new Date(blog.date))}
              </time>
            ) : (
              <span>SOON</span>
            )}
          </span>
          <span className='text-card-foreground text-xs flex items-center gap-1'>
            <Eye className='w-4 h-4' />
            &nbsp;
            {Intl.NumberFormat('en-US', {
              notation: 'compact',
            }).format(views)}
          </span>
        </div>
        <h2 className='z-20 text-xl font-medium duration-1000 lg:text-3xl text-card-foreground dark:group-hover:text-white font-display'>
          {blog.title}
        </h2>
        <p className='z-20 mt-4 text-sm  duration-1000 text-card-foreground dark:group-hover:text-zinc-200'>
          {blog.description}
        </p>
      </article>
    </Link>
  );
};
