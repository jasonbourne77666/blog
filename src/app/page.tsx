import Header from "./components/Header";
import Particles from "./components/Particles";
import Link from "next/link";

const navigation = [
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <main className="min-h-screen text-foreground overflow-hidden  bg-theme-gradient relative z-10">
      {/* 主题渐变背景说明：
          使用 bg-theme-gradient 自定义类，通过CSS变量控制渐变
          浅色主题：gray-50 -> slate-100/30 -> gray-50 (微妙的浅色渐变)
          深色主题：black -> zinc-600/20 -> black (深色渐变)
          渐变方向：从右下到左上 (to top left) */}
      {/* 头部导航 */}
      <Header />
      <Particles
        className="absolute inset-0 -z-1 animate-fade-in"
        quantity={100}
      />
      <section className="container mx-auto px-4 py-8 pt-20 flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
        <nav className="my-16 animate-fade-in">
          <ul className="flex items-center justify-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <h1 className=" py-3.5 px-0.5 z-10 text-8xl duration-1000 bg-white cursor-pointer text-edge-outline animate-title font-display sm:text-9xl md:text-9xl whitespace-nowrap bg-clip-text font-bold">
          倪大富
        </h1>
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="my-16 text-center animate-fade-in">
          <h2 className="text-sm text-zinc-500 ">
            就一个个人网站，学习和测试用
          </h2>
        </div>
      </section>
    </main>
  );
}
