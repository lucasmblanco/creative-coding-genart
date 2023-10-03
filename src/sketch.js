const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random'); 

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 100;
    for (let x = 0; x < count; x++){
      for (let y = 0; y < count; y++){
        const u = x / (count - 1);
        const v = y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  }

  const points = createGrid().filter(() => Math.random() > 0.5); 
  const margin = 200;
  return ({ context, width, height }) => {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, width, height);
    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.beginPath();
      context.arc(x, y, 1, 0, Math.PI * 2, false);
      context.strokeStyle = 'pink';
      context.lineWidth = 5; 
      context.stroke();                                   
    })
  };
};
canvasSketch(sketch, settings);