"use strict"
class Player extends Box {
    constructor(width, height, depth, color, position){
        super(width, height, depth, color, position);
        this.velocity = new THREE.Vector2(0.0, 0.0);
        this.mesh.autoUpdateMatrix = true;
    }
}