const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random'); 
const palettes = require('nice-color-palettes');

const settings = {
    dimensions: [2048, 2048]
};

function difPoint(grid, [x, y]) {
    const [x2, y2] = random.pick(grid);
    if (x2 !== x && y2 !== y && y2 !== 1 ) {
        return [x2, y2];
    } else {
        return difPoint(grid, [x, y]); 
    }
}

random.setSeed(random.getRandomSeed());
console.log(random.getSeed()); 

const sketch = () => {
    const palette = random.shuffle(random.pick(palettes));
    const createGrid = () => {
        const points = [];
        const count = 6;
        for (let i = 0; i < count; i++){
            for (let j = 0; j < count; j++){
                const u = i / (count - 1);
                const v = j / (count - 1);
                points.push([u, v]);
            }
        }
        return points;
    }
    const grid = createGrid();
    const margin = 50; 
    return ({ context, width, height }) => {
        context.fillStyle = 'white'; 
        context.fillRect(0, 0, width, height); 
        // grid.forEach(point => {
        //     const [u, v] = point;
        //     const x = lerp(margin, width - margin, u);
        //     const y = lerp(margin, height - margin, v);
        //     context.beginPath();
        //     //context.arc(x, y, 200, 0, Math.PI * 2, false);
        //     context.font = `30px "Arial"`;
        //     context.fillText(`(${u}, ${v})`, x, y);
        //     context.fillStyle = 'red';
        //     context.fill();
        // })
        grid.filter((point) => point[1] < 0.8).forEach(([x, y]) => {
            const to = difPoint(grid, [x, y]); 
            context.beginPath();
            context.moveTo(lerp(margin, width - margin, x), lerp(margin, height - margin, y));
            context.lineTo(lerp(margin, height - margin, to[0]), lerp(margin, height - margin, to[1]));
            context.lineTo(lerp(margin, height - margin, to[0]), lerp(margin, height - margin, 1));
            context.lineTo(lerp(margin, width - margin, x), lerp(margin, height - margin, 1));
            context.lineTo(lerp(margin, width - margin, x), lerp(margin, height - margin, y));
            context.strokeStyle = 'white'
            context.lineWidth = 20;
            context.stroke();
            context.fillStyle = random.pick(palette);
            context.fill();
            context.closePath()
        })        
    }
}

canvasSketch(sketch, settings);