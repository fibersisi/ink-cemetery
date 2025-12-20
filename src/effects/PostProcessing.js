import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const BlurShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'strength': { value: 0.0 }, // 0 = clear
        'resolution': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float strength;
        varying vec2 vUv;
        
        void main() {
            vec4 color = vec4(0.0);
            float total = 0.0;
            
            if (strength <= 0.01) {
                gl_FragColor = texture2D(tDiffuse, vUv);
                return;
            }

            // Simple blur kernel
            for(float i = -2.0; i <= 2.0; i++) {
                for(float j = -2.0; j <= 2.0; j++) {
                    vec2 offset = vec2(i, j) * strength * 0.002; 
                    // Adjust aspect ratio if needed, but simple reduced strength is enough for effect
                    color += texture2D(tDiffuse, vUv + offset);
                    total += 1.0;
                }
            }
            gl_FragColor = color / total;
        }
    `
};

export class PostProcessing {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        this.blurPass = new ShaderPass(BlurShader);
        this.composer.addPass(this.blurPass);

        this.clarity = 1.0; // 1 = clear, 0 = blurred
        this.targetClarity = 1.0;

        // Scroll listener to restore clarity
        window.addEventListener('wheel', (e) => {
            this.targetClarity = Math.min(1.0, this.targetClarity + 0.2);
        });

        // Also listen to any key press or mouse move to slightly help?
        // User requested scroll specifically, but maybe movement helps too?
        // Sticking to scroll as requested.
    }

    onResize(width, height) {
        this.composer.setSize(width, height);
        this.blurPass.uniforms.resolution.value.set(width, height);
    }

    update(dt) {
        // Degrade clarity over time
        // E.g. loses 10% clarity per second
        this.targetClarity = Math.max(0.0, this.targetClarity - dt * 0.05);

        // Smooth interpolation
        this.clarity += (this.targetClarity - this.clarity) * 0.1;

        // Map to strength
        const maxBlur = 10.0;
        this.blurPass.uniforms.strength.value = (1.0 - this.clarity) * maxBlur;

        this.composer.render();
    }
}
