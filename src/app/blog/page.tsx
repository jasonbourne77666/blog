import Header from "../components/Header";
import { Card } from "../components/Card";
import { Article } from "./article";

const data = [
  {
    slug: "blog-1",
    title: "博客1",
    description: "博客1的描述",
    date: "2025-01-01",
    views: 100000,
  },
  {
    slug: "blog-2",
    title: "博客2",
    description: "博客2的描述",
    date: "2025-01-02",
    views: 200,
  },
];
const data2 = [
  {
    slug: "blog-3",
    title: "博客3",
    description: "博客3的描述",
    date: "2025-01-03",
    views: 100000,
  },
  {
    slug: "blog-4",
    title: "博客4",
    description: "博客4的描述",
    date: "2025-01-04",
    views: 200,
  },
  {
    slug: "blog-5",
    title: "博客5",
    description: "博客5的描述",
    date: "2025-01-05",
    views: 200,
  },
  {
    slug: "blog-6",
    title: "博客6",
    description: "博客6的描述",
    date: "2025-01-06",
    views: 200,
  },
  {
    slug: "blog-7",
    title: "博客7",
    description: "博客7的描述",
    date: "2025-01-07",
    views: 200,
  },
  {
    slug: "blog-8",
    title: "博客8",
    description: "博客8的描述",
    date: "2025-01-08",
    views: 200,
  },
  {
    slug: "blog-9",
    title: "博客9",
    description: "博客9的描述",
    date: "2025-01-09",
    views: 200,
  },
  {
    slug: "blog-10",
    title: "博客10",
    description: "博客10的描述",
    date: "2025-01-10",
    views: 200,
  },
  {
    slug: "blog-11",
    title: "博客11",
    description: "博客11的描述",
    date: "2025-01-11",
    views: 200,
  },
];

export default async function BlogPage() {
  return (
    <div className="relative pb-16">
      <Header />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl text-card-foreground font-bold tracking-tight sm:text-4xl">
            博客页
          </h2>
          <p className="mt-4 text-gray-800 dark:text-gray-300">
            一些工作中或者学习的笔记，记录一些技术点，分享一些经验。
          </p>
        </div>
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Article blog={data[0]} views={data[0].views ?? 0} />
          </Card>
          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {data.map((blog) => (
              <Card key={blog.slug}>
                <Article blog={blog} views={blog.views ?? 0} />
              </Card>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {data2
              .filter((_, i) => i % 3 === 0)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data2
              .filter((_, i) => i % 3 === 1)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data2
              .filter((_, i) => i % 3 === 2)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
