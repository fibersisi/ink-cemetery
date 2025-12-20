import * as THREE from 'three';
import { Tombstones } from './Tombstones.js';
import { InputManager } from '../controls/InputManager.js';
import { PostProcessing } from '../effects/PostProcessing.js';

export class World {
    constructor(container) {
        this.container = container;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.inputManager = new InputManager();
        this.cameraRotation = { x: 0, y: 0 };
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        // Renderer Setup
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Camera Setup (Start slightly back)
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, -10);

        // Scene Basic Aesthetic (Ink style: Fog + Background)
        this.scene.background = new THREE.Color(0xeeeeee);
        this.scene.fog = new THREE.FogExp2(0xeeeeee, 0.05);

        // Lights
        this.setupLights();

        // Ground
        this.setupGround();

        // Tombstones
        this.tombstones = new Tombstones(this.scene);

        // Post Processing
        this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);

        // Resize Event
        window.addEventListener('resize', () => this.onResize());

        // Start Loop
        this.render();
    }

    // ... existing setupLights and setupGround ...

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);
    }

    setupGround() {
        // Basic ground for now
        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (this.postProcessing) this.postProcessing.onResize(this.width, this.height);
    }

    updateControls() {
        // Movement
        const move = this.inputManager.getMovement();
        const speed = 0.1;

        // Calculate forward/right vectors based on camera rotation
        const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation);
        forward.y = 0; // Keep movement on ground plane
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0).applyEuler(this.camera.rotation);
        right.y = 0;
        right.normalize();

        this.camera.position.add(forward.multiplyScalar(-move.z * speed));
        this.camera.position.add(right.multiplyScalar(move.x * speed));

        // Look
        const mouseDelta = this.inputManager.getMouseDelta();
        const sensitivity = 0.002;

        this.cameraRotation.y -= mouseDelta.x * sensitivity;
        this.cameraRotation.x -= mouseDelta.y * sensitivity;

        // Clamp look up/down
        this.cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraRotation.x));

        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.x = this.cameraRotation.x;
        this.camera.rotation.y = this.cameraRotation.y;
    }

    render() {
        const dt = this.clock.getDelta();
        this.updateControls();

        if (this.postProcessing) {
            this.postProcessing.update(dt);
        } else {
            this.renderer.render(this.scene, this.camera);
        }

        requestAnimationFrame(() => this.render());
    }
}
