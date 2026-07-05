import React, { useState, useEffect } from 'react';
import { CanvasView } from './CanvasView';
import './App.css';

export interface SingleShape {
  type: 'circle' | 'square' | 'triangle';
  color: string;
  size: number;
}

const colors = ['#ff0000', '#0000ff', '#00ff00']; 

// Глобальное расширение интерфейса Window для безопасной работы с TypeScript без использования any
declare global {
  interface Window {
    triggerTestShape?: (type: SingleShape['type'], color: string) => void;
    resetTestShape?: () => void;
  }
}

export const App: React.FC = () => {
  const [shape, setShape] = useState<SingleShape | null>(null);

  // Метод для обычного использования (рандом)
  const handleShowRandom = () => {
    if (shape) {
      setShape(null);
    } else {
      const types: Array<SingleShape['type']> = ['circle', 'square', 'triangle'];
      //const colors = ['#ff0000', '#0000ff', '#00ff00']; 
      setShape({
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 150
      });
    }
  };

  // Перенос сайд-эффекта в хук жизненного цикла, чтобы избежать ошибок иммутабельности при рендере
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerTestShape = (type: SingleShape['type'], color: string) => {
        setShape({ type, color, size: 200 }); // Фиксированный размер для эталона
      };
      
      window.resetTestShape = () => {
        setShape(null);
      };
    }

    // Чистим за собой глобальные методы при размонтировании компонента
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerTestShape;
        delete window.resetTestShape;
      }
    };
  }, []); // Пустой массив зависимостей гарантирует выполнение кода один раз при старте приложения

     return (
    <div 
      className="app-container" 
      data-testid="app-root"
      // Передаем текущий тип и цвет наружу в DOM, чтобы тест мог их прочитать
      data-shape-type={shape?.type || 'none'}
      data-shape-color={shape?.color || 'none'}
    >
      <CanvasView currentShape={shape} />
      
      <button className="control-button" data-testid="show-btn" onClick={handleShowRandom}>
        {shape ? 'Hide Shape' : 'Show Shape'}
      </button>
    </div>
  );};
