import './style.css'
import { World } from './scene/World.js';

console.log('Immersive Ink Cemetery Initialized')

const app = document.querySelector('#app');
const world = new World(app);
