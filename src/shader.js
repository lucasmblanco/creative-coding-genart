const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

const frag = glsl( /* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv; // vec2 -> x, y - vec3 -> x, y, z - vec4 -> x, y, z, w

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    // vec3 colorA = sin(time) + vec3(1.0, 0.0, 0.0);
    // vec3 colorB = vec3(0.0, 1.0, 0.0);
    

    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);
    // vec3 color = mix(colorA, colorB, vUv.x + vUv.y * sin(time));
    float alpha = smoothstep(0.251, 0.25, dist);
    // gl_FragColor = vec4(color, alpha); // red, gree, blue, alpha
    float n = noise(vec3(center * 0.7, time * 0.5));
    vec3 color = hsl2rgb(
      0.8 + n * 0.1, // low hue, noise and offset, the largest offset the more colors
      0.5,
      0.5
    ); 
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'hsl(0, 0%, 90%)',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time, 
      aspect: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
