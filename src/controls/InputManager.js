export class InputManager {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseXDelta = 0;
        this.mouseYDelta = 0;

        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.keys.forward = true; break;
            case 'KeyS': this.keys.backward = true; break;
            case 'KeyA': this.keys.left = true; break;
            case 'KeyD': this.keys.right = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.keys.forward = false; break;
            case 'KeyS': this.keys.backward = false; break;
            case 'KeyA': this.keys.left = false; break;
            case 'KeyD': this.keys.right = false; break;
        }
    }

    onMouseMove(event) {
        this.mouseXDelta = event.movementX;
        this.mouseYDelta = event.movementY;
    }

    getMovement() {
        const move = { x: 0, z: 0 };
        if (this.keys.forward) move.z -= 1;
        if (this.keys.backward) move.z += 1;
        if (this.keys.left) move.x -= 1;
        if (this.keys.right) move.x += 1;
        return move;
    }

    getMouseDelta() {
        const delta = { x: this.mouseXDelta, y: this.mouseYDelta };
        this.mouseXDelta = 0; // Reset after reading
        this.mouseYDelta = 0;
        return delta;
    }
}
