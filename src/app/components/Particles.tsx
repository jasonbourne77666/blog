'use client';

import React, { useRef, useEffect } from 'react';
import { useMousePosition } from '@/util/mouse';
import { useTheme } from '../contexts/ThemeContext';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export default function Particles({
  className = '',
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
   
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  // 获取当前主题
  const { resolvedTheme } = useTheme();

  // 根据主题获取粒子颜色
  const getParticleColor = (alpha: number) => {
    if (resolvedTheme === 'dark') {
      // 深色主题：使用较暗的白色粒子，降低透明度
      const minAlpha = 0.15; // 降低最低可见度
      return `rgba(255, 255, 255, ${Math.max(alpha * 0.4, minAlpha)})`;
    } else {
      // 浅色主题：使用更深的暗色粒子，增加对比度
      return `rgba(30, 41, 59, ${Math.min(alpha * 1.1, 0.8)})`;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();
    animate();

    // 创建一个主题感知的resize处理器
    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resolvedTheme]); // 添加resolvedTheme依赖

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh, resolvedTheme]);

  // 监听主题变化，重新创建所有粒子以适应新主题
  useEffect(() => {
    console.log('Theme changed to:', resolvedTheme); // 调试日志
    if (circles.current.length > 0) {
      // 主题变化时清空现有粒子并重新创建
      circles.current.length = 0;
      drawParticles();
    }
  }, [resolvedTheme]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    // 根据主题调整粒子大小
    const size =
      resolvedTheme === 'dark'
        ? Math.floor(Math.random() * 3) + 1.5 // 深色主题：适中的粒子 1.5-4.5
        : Math.floor(Math.random() * 3) + 0.5; // 浅色主题：正常大小 0.5-3.5
    const alpha = 0;
    // 根据主题调整目标透明度
    const targetAlpha =
      resolvedTheme === 'dark'
        ? parseFloat((Math.random() * 0.4 + 0.2).toFixed(1)) // 深色主题：较低透明度范围 0.2-0.6
        : parseFloat((Math.random() * 0.8 + 0.2).toFixed(1)); // 浅色主题：正常透明度
    const dx = (Math.random() - 0.5) * 0.2;
    const dy = (Math.random() - 0.5) * 0.2;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);

      // 添加发光效果
      if (resolvedTheme === 'dark') {
        // 深色主题：柔和的发光效果
        context.current.shadowColor = `rgba(255, 255, 255, 0.3)`;
        context.current.shadowBlur = size * 2;
      } else {
        // 浅色主题：较轻的阴影效果
        context.current.shadowColor = `rgba(30, 41, 59, ${alpha * 0.2})`;
        context.current.shadowBlur = size * 2;
      }

      // 绘制主要粒子
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      // 使用主题感知的颜色
      context.current.fillStyle = getParticleColor(alpha);
      context.current.fill();

      // 在深色主题下添加轻微的外圈发光效果
      if (resolvedTheme === 'dark') {
        context.current.shadowColor = 'transparent';
        context.current.shadowBlur = 0;

        // 单层外圈（轻微光晕）
        context.current.beginPath();
        context.current.arc(x, y, size * 1.5, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
        context.current.fill();
      }

      // 重置阴影效果
      context.current.shadowColor = 'transparent';
      context.current.shadowBlur = 0;

      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      // Handle the alpha value
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left edge
        canvasSize.current.w - circle.x - circle.translateX - circle.size, // distance from right edge
        circle.y + circle.translateY - circle.size, // distance from top edge
        canvasSize.current.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;
      // circle gets out of the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // remove the circle from the array
        circles.current.splice(i, 1);
        // create a new circle
        const newCircle = circleParams();
        drawCircle(newCircle);
        // update the circle position
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha,
          },
          true,
        );
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden='true'>
      <canvas ref={canvasRef} />
    </div>
  );
}
