const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 5;
    for (let x = 0; x < count; x++){
      for (let y = 0; y < count; y++){
        const u = x / (count - 1);
        const v = y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  }

  const points = createGrid(); 
  const margin = 500;
  return ({ context, width, height }) => {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, width, height);
    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.beginPath();
      context.arc(x, y, 100, 30, Math.PI, false);
      context.strokeStyle = 'pink';
      context.lineWidth = 40; 
      context.stroke();                                   
    })
  };
};
canvasSketch(sketch, settings);