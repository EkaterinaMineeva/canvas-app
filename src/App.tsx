import React, { useState, useEffect } from 'react';
import { CanvasView } from './CanvasView';
import './App.css';

export interface SingleShape {
  type: 'circle' | 'square' | 'triangle';
  innerType: 'pupil' | 'cross' | 'ring';
  color: string;
  size: number;
}

declare global {
  interface Window {
    triggerTestShape?: (type: SingleShape['type'], color: string) => void;
    resetTestShape?: () => void;
  }
}

export const App: React.FC = () => {
  const [shape, setShape] = useState<SingleShape | null>(null);

  const handleShowRandom = () => {
    if (shape) {
      setShape(null);
    } else {
      const types: Array<SingleShape['type']> = ['circle', 'square', 'triangle'];
      const innerTypes: Array<SingleShape['innerType']> = ['pupil', 'cross', 'ring']; 
      const colors = ['#ff0000', '#0000ff', '#00ff00']; 
      
      setShape({
        type: types[Math.floor(Math.random() * types.length)],
        innerType: innerTypes[Math.floor(Math.random() * innerTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 150
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerTestShape = (type: SingleShape['type'], color: string) => {
        setShape({ type, innerType: 'cross', color, size: 200 }); 
      };
      window.resetTestShape = () => setShape(null);
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerTestShape;
        delete window.resetTestShape;
      }
    };
  }, []);

  return (
    <div 
      className="app-container" 
      data-testid="app-root"
      data-shape-type={shape?.type || 'none'}
      data-shape-color={shape?.color || 'none'}
    >
      <CanvasView currentShape={shape} />
      
      <button className="control-button" data-testid="show-btn" onClick={handleShowRandom}>
        {shape ? 'Hide Shape' : 'Show Shape'}
      </button>
    </div>
  );
};
