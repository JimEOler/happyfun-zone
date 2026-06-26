import { useEffect, useRef } from 'react';
import { ThemeId } from '../types';

interface MatrixRainProps {
  themeId: ThemeId;
  opacity?: number;
}

export default function MatrixRain({ themeId, opacity = 0.15 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color based on active theme
    const color = themeId === 'phosphor-amber' ? '#ffb000' : '#00ff41';

    const columns = Math.floor(width / 16);
    const drops: number[] = Array(columns).fill(1);

    // Characters from katakana + letters + numbers
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      // Semi-transparent background to create a trail effect
      ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Render characters
        const x = i * 16;
        const y = drops[i] * 16;

        ctx.fillText(char, x, y);

        // Reset if it hits bottom or randomly
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
      style={{ opacity, mixBlendMode: 'screen' }}
      id="matrix-rain-canvas"
    />
  );
}
