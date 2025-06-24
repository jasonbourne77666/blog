'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

const Canvas: React.FC<any> = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const drawTree = () => {
      const canvas = document.getElementById('draw-tree');
      setSize({
        width: canvas?.clientWidth ?? 0,
        height: canvas?.clientHeight ?? 0,
      });
    };
    drawTree();
  }, []);

  function drawTree(props: {
    ctx: CanvasRenderingContext2D;
    v0: number[];
    len: number;
    thick: number;
    deg: number;
    color: string;
  }) {
    const { ctx, v0, len, thick, deg, color } = props;
    if (thick < 2) {
      ctx.beginPath();
      ctx.arc(v0[0], v0[1], thick * 4, 0, 2 * Math.PI);
      ctx.fillStyle = resolvedTheme === 'dark' ? '#fbbf24' : '#f59e0b';
      ctx.fill();
      return;
    }
    if (thick < 10 && Math.random() > 0.8) return;

    const v1 = [
      v0[0] + len * Math.cos((deg * Math.PI) / 180),
      v0[1] + len * Math.sin((deg * Math.PI) / 180),
    ];

    ctx.beginPath();
    ctx.moveTo(v0[0], v0[1]);
    ctx.lineTo(v1[0], v1[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.stroke();
    // 左分支
    drawTree({
      ctx,
      v0: v1,
      len: len * 0.8,
      thick: thick * 0.8,
      deg: deg + Math.random() * 30,
      color,
    });
    // 右分支
    drawTree({
      ctx,
      v0: v1,
      len: len * 0.8,
      thick: thick * 0.8,
      deg: deg - Math.random() * 30,
      color,
    });
    ctx.closePath();
  }

  useEffect(() => {
    if (!size.width || !size.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, size.width, size.height);

    // 填充背景
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 设置背景颜色
    ctx.fillStyle = resolvedTheme === 'dark' ? '#1f2937' : '#ffffff';
    // 填充背景
    ctx.fillRect(0, 0, size.width, size.height);

    // 设置画布坐标系
    ctx.translate(size.width / 2, size.height);
    // 翻转y轴
    ctx.scale(1, -1);

    // 设置树干颜色
    const trunkColor = resolvedTheme === 'dark' ? '#8b5cf6' : '#7c3aed';

    drawTree({
      ctx,
      v0: [0, 1],
      len: 150,
      thick: 10,
      deg: 90,
      color: trunkColor,
    });
  }, [size, resolvedTheme]);

  return (
    <div className='h-200' id='draw-tree'>
      <canvas ref={canvasRef} width={size.width} height={size.height}></canvas>
    </div>
  );
};

export default Canvas;
