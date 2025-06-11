import Header from "../components/Header";
import { Card } from "../components/Card";
import { Wrapper } from "@/app/components/Wrapper";

const data = [
  {
    slug: "/practice/blog-1",
    title: "博客1",
    description: "博客1的描述",
    date: "2025-01-01",
    views: 100000,
  },
  {
    slug: "/practice/blog-2",
    title: "博客2",
    description: "博客2的描述",
    date: "2025-01-02",
    views: 200,
  },
];

const data2 = [
  {
    slug: "/practice/js/drag",
    title: "拖拽",
    description: "拖拽功能",
    date: "2025-01-03",
    views: 100000,
  },
  {
    slug: "/practice/js/interceptor",
    title: "洋葱模型",
    description: "模拟洋葱模型",
    date: "2025-01-04",
    views: 200,
  },
  {
    slug: "/practice/js/position-by-math",
    title: "数学布局",
    description: "通过数学公式计算布局",
    date: "2025-01-05",
    views: 200,
  },
  {
    slug: "/practice/js/request-idle-callback",
    title: "分时函数",
    description: "通过requestIdleCallback实现分时函数",
    date: "2025-01-06",
    views: 200,
  },
  {
    slug: "/practice/js/custom-redux",
    title: "自定义redux",
    description: "自定义redux",
    date: "2025-01-07",
    views: 200,
  },
  {
    slug: "/practice/js/music-player",
    title: "音乐播放器",
    description: "字幕滚动效果",
    date: "2025-01-08",
    views: 200,
  },
  {
    slug: "/practice/js/shop-cart",
    title: "购物车",
    description: "商品抛物线移动效果",
    date: "2025-01-09",
    views: 200,
  },
];
const data3 = [];

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
            <Wrapper blog={data[0]} views={data[0].views ?? 0} />
          </Card>
          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {data.map((blog) => (
              <Card key={blog.slug}>
                <Wrapper blog={blog} views={blog.views ?? 0} />
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
                  <Wrapper blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data2
              .filter((_, i) => i % 3 === 1)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Wrapper blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {data2
              .filter((_, i) => i % 3 === 2)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Wrapper blog={blog} views={blog.views ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
