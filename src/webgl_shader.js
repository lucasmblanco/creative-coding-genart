// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random'); 
const palettes = require('nice-color-palettes');
//const eases = require('eases');
const glsl = require('glslify');
import eases from 'eases';


const settings = {
  dimensions: [ 512, 512], 
  animate: true,
  fps: 24,
  duration: 10,
  context: "webgl",
  
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("hsl(0,0%,95%)", 1);


  const camera = new THREE.OrthographicCamera();
  const scene = new THREE.Scene();


  const geometry = new THREE.SphereGeometry(1, 32, 16);

    const fragmentShader = glsl(/* glsl */`
    varying vec2 vUv;
    uniform vec3 color;
    uniform float playhead;

    #pragma glslify: noise = require('glsl-noise/simplex/3d');

    void main () {
       // vec3 color = vec3(1.0);
        float offset = 0.8 * noise(vec3(vUv.xy * 20.0, playhead));
        gl_FragColor = vec4(vec3(color * vUv.x + offset), 1.0);
        // * vUv.x
        
    }
  `);
    const vertexShader = glsl(/* glsl */`
    varying vec2 vUv;
    uniform float playhead;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');
    
    void main () {
        vUv = uv;
        vec3 pos = position.xyz;
       // pos += noise(vec4(position.xyz, time * 0.5));
       pos += normal * noise(vec4(pos.xyz * 4.0, playhead)); 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `);

  const palette = random.pick(palettes);
  // Setup a mesh with geometry + material
    const meshes = []; 
  for (let i = 0; i < 1; i++){
    const mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
            color: {value: new THREE.Color(random.pick(palette))},
            playhead: { value: 0 }
        }
       // color: random.pick(palette)
    }));
    // mesh.position.set(
    //  random.range(-1, 1), random.range(-1, 1), random.range(-1, 1) // x,y,z 
    // ); 
    // mesh.scale.set(
    //   random.range(-1, 1), random.range(-1, 1), random.range(-1, 1)
    // )
    // mesh.scale.multiplyScalar(0.25); 
      scene.add(mesh);
      meshes.push(mesh); 
  }
  const ambientLight = new THREE.AmbientLight('hsl(0,0%, 40%)', 1.0); 
  scene.add(ambientLight);
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 4, 0)
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      // camera.aspect = viewportWidth / viewportHeight;
      // camera.updateProjectionMatrix();
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      //controls.update();
      const t = Math.sin(playhead * Math.PI * 2)
      scene.rotation.y = eases.quadInOut(t); // playhead solo si hay duration sino time
        renderer.render(scene, camera);
        meshes.forEach(m => m.material.uniforms.playhead.value = playhead)
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
    //  controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
