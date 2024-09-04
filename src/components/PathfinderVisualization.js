import React, { useRef, useEffect, useState } from 'react';

const PathfinderVisualization = ({ width = 500, height = 750 }) => {
  const canvasRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  const FLOOR_WIDTH = 50;
  const FLOOR_LENGTH = 75;
  const STEP_LENGTH = 3;
  const STEP_DURATION = 500;
  const PATH_VARIANCE = 0.2;

  function generateWalkingPath(startX, startY, endX, endY) {
    const path = [];
    let currentX = startX;
    let currentY = startY;
    let currentTime = Date.now();

    while (Math.abs(currentX - endX) > STEP_LENGTH || Math.abs(currentY - endY) > STEP_LENGTH) {
      const deltaX = endX - currentX;
      const deltaY = endY - currentY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      let stepX = (deltaX / distance) * STEP_LENGTH;
      let stepY = (deltaY / distance) * STEP_LENGTH;

      stepX += (Math.random() - 0.5) * PATH_VARIANCE * STEP_LENGTH;
      stepY += (Math.random() - 0.5) * PATH_VARIANCE * STEP_LENGTH;

      currentX += stepX;
      currentY += stepY;

      currentX = Math.max(0, Math.min(currentX, FLOOR_WIDTH - 1));
      currentY = Math.max(0, Math.min(currentY, FLOOR_LENGTH - 1));

      const impression = {
        x: Math.round(currentX),
        y: Math.round(currentY),
        startTime: currentTime,
        duration: STEP_DURATION + Math.random() * 100 - 50
      };

      path.push(impression);
      currentTime += impression.duration;
    }

    path.push({
      x: endX,
      y: endY,
      startTime: currentTime,
      duration: STEP_DURATION
    });

    return path;
  }

  function generateMultiplePaths(numberOfPaths) {
    const paths = [];
    for (let i = 0; i < numberOfPaths; i++) {
      const startX = Math.floor(Math.random() * FLOOR_WIDTH);
      const startY = Math.floor(Math.random() * FLOOR_LENGTH);
      const endX = Math.floor(Math.random() * FLOOR_WIDTH);
      const endY = Math.floor(Math.random() * FLOOR_LENGTH);
      const path = generateWalkingPath(startX, startY, endX, endY);
      if (path.length > 0) {
        paths.push(path);
      }
    }
    return paths;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scaleX = canvas.width / FLOOR_WIDTH;
    const scaleY = canvas.height / FLOOR_LENGTH;

    let paths = [];
    let animationStep = 0;
    let animationId;

    function drawPaths() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      paths.forEach((path, pathIndex) => {
        if (path.length === 0) return;

        const color = `hsl(${pathIndex * 360 / paths.length}, 100%, 50%)`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        // Draw the entire path up to the current animation step
        ctx.beginPath();
        ctx.moveTo(path[0].x * scaleX, path[0].y * scaleY);
        for (let i = 1; i <= Math.min(animationStep, path.length - 1); i++) {
          ctx.lineTo(path[i].x * scaleX, path[i].y * scaleY);
        }
        ctx.stroke();

        // Draw start point
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(path[0].x * scaleX, path[0].y * scaleY, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw current point (moving dot)
        if (animationStep < path.length) {
          const currentPoint = path[Math.min(animationStep, path.length - 1)];
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(currentPoint.x * scaleX, currentPoint.y * scaleY, 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Draw end point if reached
        if (animationStep >= path.length - 1) {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          const endPoint = path[path.length - 1];
          ctx.arc(endPoint.x * scaleX, endPoint.y * scaleY, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      animationStep++;

      if (animationStep <= Math.max(...paths.map(p => p.length))) {
        animationId = setTimeout(() => requestAnimationFrame(drawPaths), 1000 / animationSpeed);
      }
    }

    function generateAndAnimatePaths() {
      paths = generateMultiplePaths(5);
      animationStep = 0;
      if (animationId) {
        clearTimeout(animationId);
      }
      drawPaths();
    }

    generateAndAnimatePaths();

    return () => {
      if (animationId) {
        clearTimeout(animationId);
      }
    };
  }, [animationSpeed]);

  const handleRegeneratePaths = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const paths = generateMultiplePaths(5);
    let animationStep = 0;
    const scaleX = canvas.width / FLOOR_WIDTH;
    const scaleY = canvas.height / FLOOR_LENGTH;

    function drawPaths() {
      // ... (same drawing logic as before)
    }

    drawPaths();
  };

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid black' }} />
      <div>
        <button onClick={handleRegeneratePaths}>Generate New Paths</button>
        <label htmlFor="speedSlider">Animation Speed:</label>
        <input
          type="range"
          id="speedSlider"
          min="1"
          max="100"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PathfinderVisualization;
