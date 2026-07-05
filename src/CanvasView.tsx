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
        const { type, innerType, color, size } = currentShape;

        ctx.save();
        ctx.translate(centerX, centerY);
        
        
        ctx.beginPath(); 
        ctx.fillStyle = color;

        if (type === 'circle') {
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'square') {
          ctx.rect(-size / 2, -size / 2, size, size);
          ctx.fill();
        } else if (type === 'triangle') {
          const h = size * 0.866;
          ctx.moveTo(0, -h * 2 / 3);          
          ctx.lineTo(size / 2, h * 1 / 3);    
          ctx.lineTo(-size / 2, h * 1 / 3);   
          ctx.closePath(); 
          ctx.fill();
        }

        
        ctx.beginPath(); 
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, size * 0.02);

        if (innerType === 'pupil') {
          const pupilRadius = size * 0.08;
          ctx.arc(0, 0, pupilRadius, 0, Math.PI * 2);
          ctx.fill();
        } else if (innerType === 'cross') {
          const crossSize = size * 0.12;
          ctx.moveTo(-crossSize, 0);
          ctx.lineTo(crossSize, 0);
          ctx.moveTo(0, -crossSize);
          ctx.lineTo(0, crossSize);
          ctx.stroke();
        } else if (innerType === 'ring') {
          const innerRingRadius = size * 0.06;
          ctx.arc(0, 0, innerRingRadius, 0, Math.PI * 2); 
          ctx.stroke();
        }

        ctx.closePath(); 
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

  return (
    <canvas 
      ref={canvasRef} 
      data-testid="canvas-element" 
      className="fullscreen-canvas" 
      data-shape-size={currentShape ? currentShape.size : 0}
    />
  );
};
