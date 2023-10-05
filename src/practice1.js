const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random'); 
const palettes = require('nice-color-palettes');

const settings = {
    dimensions: [2048, 2048]
};

function diffPoint(grid, p) {
    const [x, y] = p;
    const { position } = random.pick(grid);
    const [x2, y2] = position; 
    if (x2 !== x && y2 !== y && y2 !== 1 ) {
        return [x2, y2];
    } else {
        return diffPoint(grid, [x, y]); 
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
                points.push({
                    color: random.pick(palette),
                    rotation: random.noise2D(u,v),
                    position: [u, v]
                });
            }
        }
        return points;
    }

    const grid = createGrid();
    const margin = 50; 
    const bg = random.pick(palette);
    return ({ context, width, height }) => {
        
        context.fillStyle = bg; 
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
        grid.forEach((data) => {
            const { rotation, position, color } = data;
            console.log(position);
            const [x, y] = position;
            const to = diffPoint(grid, position); 
            context.save();
            context.beginPath();
            context.moveTo(lerp(margin, width - margin, x), lerp(margin, height - margin, y));
            context.lineTo(lerp(margin, height - margin, to[0]), lerp(margin, height - margin, to[1]));
            context.lineTo(lerp(margin, height - margin, to[0]), lerp(margin, height - margin, 1));
            context.lineTo(lerp(margin, width - margin, x), lerp(margin, height - margin, 1));
            context.lineTo(lerp(margin, width - margin, x), lerp(margin, height - margin, y));
            context.rotate(rotation);
            context.strokeStyle = bg;
            context.lineWidth = 20;
            context.stroke();
            context.fillStyle = color;
            context.fill();
            context.closePath();
            context.restore();
        })        
    }
}

canvasSketch(sketch, settings);