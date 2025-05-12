<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 666);
    camera.position.set(0, 0, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const loader = new PLYLoader();
    loader.load('/heart_pointcloud.ply', geometry => {
      geometry.computeBoundingSphere();
      const material = new THREE.PointsMaterial({ color: 0xff5555, size: 0.03 });
      const pointCloud = new THREE.Points(geometry, material);
      pointCloud.rotation.x -= 1.5;
      pointCloud.rotation.y += 0;
      pointCloud.rotation.z += 0.5;
      scene.add(pointCloud);

      const bpm = 72;
      const beatsPerSecond = bpm / 60;
      const clock = new THREE.Clock();

      const bpmSpan = document.getElementById('bpm')!;
      const zoomSpan = document.getElementById('zoom')!;

      function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        const pulse = Math.sin(elapsed * Math.PI * 2 * beatsPerSecond);
        const scale = THREE.MathUtils.clamp(1 + pulse * 0.04, 0.98, 1.08);
        pointCloud.scale.set(scale, scale, scale);
        pointCloud.rotation.z += 0.002;

        const zoom = camera.position.distanceTo(controls.target);
        bpmSpan.textContent = String(bpm);
        zoomSpan.textContent = zoom.toFixed(2);

        renderer.render(scene, camera);
      }

      animate();
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });
</script>
<div class="overlay">
  <div>BPM: <span id="bpm">72</span></div>
  <div>Zoom: <span id="zoom">10</span></div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-family: sans-serif;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    z-index: 10;
    pointer-events: none;
  }
  :global(body) {
    margin: 0;
    overflow: hidden;
  }
</style>