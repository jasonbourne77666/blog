'use client';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'framer-motion';

import { MouseEventHandler, PropsWithChildren } from 'react';

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className='overflow-hidden relative duration-700 border rounded-xl  group md:gap-8  border-zinc-600 hover:bg-zinc-300/10 hover:shadow-md dark:hover:bg-zinc-400/0 dark:hover:border-zinc-400/50'
    >
      <div className='pointer-events-none'>
        <div className='absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]' />
        <motion.div
          className='absolute inset-0 z-10 group-hover:bg-gradient-to-br opacity-100 group-hover:via-zinc-400/80 transition duration-1000  dark:group-hover:via-zinc-100/10 dark:group-hover:opacity-50 '
          style={style}
        />
        {/* <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100 group-hover:bg-zinc-400/10 dark:group-hover:opacity-100"
          style={style}
        /> */}
      </div>
      {children}
    </div>
  );
};
