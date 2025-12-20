import * as THREE from 'three';

export class Tombstones {
    constructor(scene) {
        this.scene = scene;
        this.count = 500; // Number of tombstones
        this.init();
    }

    init() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x222222 });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.count);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        const spread = 100; // Spread of the graveyard

        for (let i = 0; i < this.count; i++) {
            // Random position
            const x = (Math.random() - 0.5) * spread;
            const z = (Math.random() - 0.5) * spread;
            const y = 0; // On ground

            // Random scale (height and thickness)
            const sx = 0.5 + Math.random() * 0.5; // width
            const sy = 1 + Math.random() * 2;   // height
            const sz = 0.2 + Math.random() * 0.3; // depth

            dummy.position.set(x, y + sy / 2, z); // Adjust y so it sits on ground
            dummy.scale.set(sx, sy, sz);

            // Random rotation (slightly crooked)
            dummy.rotation.y = (Math.random() - 0.5) * 0.5;
            dummy.rotation.z = (Math.random() - 0.5) * 0.2;
            dummy.rotation.x = (Math.random() - 0.5) * 0.2;

            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }

        this.scene.add(this.mesh);
    }
}
