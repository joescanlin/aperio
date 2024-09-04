import React, { useRef, useEffect, useState } from 'react';

interface PathfinderVisualizationProps {
  width: number;
  height: number;
}

const PathfinderVisualization: React.FC<PathfinderVisualizationProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [numPaths, setNumPaths] = useState(5);

  useEffect(() => {
    generatePaths();
  }, [width, height, numPaths]);

  const generatePaths = () => {
    const newPaths = Array.from({ length: numPaths }, () => ({
      points: Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height
      }))
    }));
    setPaths(newPaths);
    setProgress(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawPaths = () => {
      ctx.clearRect(0, 0, width, height);
      paths.forEach((path, index) => {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${index * (360 / paths.length)}, 100%, 50%)`;
        path.points.slice(0, Math.floor(path.points.length * progress)).forEach((point: any, i: number) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      });
    };

    drawPaths();
  }, [paths, progress, width, height]);

  return (
    <div>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        style={{ border: '1px solid #ccc' }}
      />
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
      </div>
      <button onClick={generatePaths}>Generate New Paths</button>
    </div>
  );
};

export default PathfinderVisualization;