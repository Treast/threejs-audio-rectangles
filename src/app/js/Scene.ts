import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Audio from './utils/Audio';

class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private controls: OrbitControls;

  private cubeSize: number = 0.05;
  private cubeNumber: number = 30;
  private cubes: THREE.Mesh[] = [];

  private audio: Audio;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.bind();
  }

  bind() {
    window.addEventListener('resize', () => this.onResize);
    window.addEventListener('click', () => {
      this.audio.play();
    });
    window.addEventListener('touchstart', () => {
      this.audio.play();
    });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  init() {
    this.camera.position.set(2, 1, 2);
    this.camera.lookAt(0, -1, 0);
    const torusMaterial = new THREE.MeshNormalMaterial();

    const cubeMaterial = new THREE.MeshLambertMaterial({
      wireframe: true,
      color: 0xfff,
    });

    this.audio = new Audio();
    this.audio.load('assets/audios/jinjer.mp3');

    for (let i = 0; i < this.cubeNumber; i += 1) {
      for (let j = 0; j < this.cubeNumber; j += 1) {
        // const h = Math.random() * 0.3 + 0.1;
        const cubeGeometry = new THREE.BoxGeometry(this.cubeSize, 0.1, this.cubeSize);
        const cube = new THREE.Mesh(cubeGeometry, torusMaterial);
        cube.position.x = i * (this.cubeSize + 0.005);
        cube.position.z = j * (this.cubeSize + 0.005);
        cube.position.y = 0;
        cube.translateY(0.05);

        this.cubes.push(cube);
        this.scene.add(cube);
      }
    }
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.audio.refreshFrequencies();

    this.renderer.render(this.scene, this.camera);

    this.controls.update();

    if (this.audio.isPlaying) {
      this.cubes.forEach((cube, i) => {
        const h = 0.5 * this.audio.getFrequency(i, this.cubes.length);
        cube.scale.y = 1 + 4 * h;
      });
    }
  }
}

export default new Scene();
