import React, { useEffect, useRef } from 'react';
import { type SingleShape } from './App';
import './CanvasView.css';

interface CanvasViewProps {
  currentShape: SingleShape | null;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ currentShape }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Адаптация канвы под реальные размеры экрана в любом режиме
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentShape) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const { type, color, size } = currentShape;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.fillStyle = color;
        ctx.beginPath();

        if (type === 'circle') {
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        } else if (type === 'square') {
          ctx.rect(-size / 2, -size / 2, size, size);
        } else if (type === 'triangle') {
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
        }

        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentShape]);

  return <canvas ref={canvasRef} data-testid="canvas-element" className="fullscreen-canvas" />;
};
