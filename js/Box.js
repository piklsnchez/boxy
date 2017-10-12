"use strict"
class Box {
    constructor(width, height, depth, color, position){
        this.mesh  = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({color: color}));
        this.mesh.autoUpdateMatrix = false;
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.updateMatrix();
    }
    
    get position(){
        return this.mesh.position;
    }
    set position(position){
        this.mesh.position.set(position.x, position.y, position.z);
    }
    
    get x(){
        return this.mesh.position.x - this.mesh.geometry.parameters.width / 2;
    }
    set x(x){
        this.mesh.position.x = x + this.mesh.geometry.parameters.width / 2;
    }
    
    get y(){
        return this.mesh.position.y - this.mesh.geometry.parameters.height / 2;
    }
    set y(y){
        this.mesh.position.y = y + this.mesh.geometry.parameters.height / 2;
    }
    
    get width(){
        return this.mesh.geometry.parameters.width;
    }
    set width(width){
        this.mesh.geometry.parameters.width = width;
    }
    
    get height(){
        return this.mesh.geometry.parameters.height;
    }
    set height(height){
        this.mesh.geometry.parameters.height = height;
    }
}