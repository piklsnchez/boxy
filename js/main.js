"use strict";
//import {Point} from "Point";
//import {Box} from "Box";
//import {Player} from "Player";
//import {Util} from "Util";
const DIRECTION = {X_POS:{}, X_NEG:{}, Y_POS:{}, Y_NEG:{}, Z_POS:{}, Z_NEG:{}};

class Boxy {
    constructor(){
        let self = this;
        this.debugDiv = document.getElementById("debug");
        
        this.scene    = new THREE.Scene();
        this.camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("renderer").appendChild(this.renderer.domElement);
        
        window.onkeydown  = function(e){self.keyDown(e)};
        window.onkeyup    = function(e){self.keyUp(e)};
        
        this.jumping      = false;
        this.gravity      = -0.05;
        this.jumpVelocity = 0.6;
        /*calls loadMap*/    
        MapBuilder.fetchMap("js/map.txt", this);
    }
    
    init(geoms){
        geoms.forEach(function(g){console.log(g.velocity);});
        let start = geoms.findIndex(function(g){return g instanceof Player;});
        if(start < 0){
            throw "Didn't find Player object";
        }
        this.player = geoms.splice(start, 1)[0];
        this.geoms = geoms;
        this.scene.add(this.player.mesh);
    
        let hemisphereLight = new THREE.HemisphereLight(0x8888ff, 0x001000, 1.0);
        this.scene.add(hemisphereLight);
    
        let directionalLight = new THREE.DirectionalLight( 0xffff88, 0.5 );
        directionalLight.position.set( 100, 100, 50 );
        this.scene.add(directionalLight);
    
        this.camera.position.z = 5;
        this.render();
    }
    
    loadMap(boxes){
        let self = this;
        boxes.forEach(function(b){
            self.scene.add(b.mesh);
        });
        this.init(boxes);
    }
    
    static main(){
        new Boxy();
    }

    render() {
        let self = this;
        window.requestAnimationFrame(function(){self.render()});
    
        self.jumping = true;
        self.geoms.filter(function(b){return self.player.mesh.position.distanceTo(b.mesh.position) < 1.5}).forEach(function(b){
            self.undoCollision(self.player, b);
        });
        if(self.jumping){
            self.player.velocity.y += self.gravity;
        }
        self.debugDiv.innerHTML = `x: ${self.player.velocity.x.toFixed(2)}, y: ${self.player.velocity.y.toFixed(2)}`;
        
        self.player.y += self.player.velocity.y;
        self.player.x += self.player.velocity.x;
        
        self.camera.position.x = self.player.x + (self.player.width/2);
        self.camera.position.y = self.player.y + 1.0;
        self.renderer.render(self.scene, self.camera);
    }
    
    /**
     * @param box1:Box player
     * @param box2:Box what the player hit
     */
    undoCollision(box1, box2){
        let xDirection = box1.velocity.x;
        let yDirection = box1.velocity.y;
        
        if(yDirection > 0){
            this.tryTop(box1, box2);
        } else {
            this.tryBottom(box1, box2);
        }
        if(xDirection != 0){
            if(xDirection > 0){
                this.tryRight(box1, box2);
            } else if(xDirection < 0){
                this.tryLeft(box1, box2);
            }
        }
    }
    
    tryTop(box1, box2){
        let ray1 = new THREE.Raycaster();
        let pos1 = box1.mesh.position.clone();
        pos1.setX(pos1.x);
        let v = new THREE.Vector3(0,1,0);
        ray1.set(pos1, v);
        let collision = ray1.intersectObject(box2.mesh);
        if(collision.length > 0 && collision[0].distance <= (box1.height/2 - 0.01)){
            box1.y = box2.y - box1.height;
            this.player.velocity.y = Math.min(0, this.player.velocity.y);
            console.log("Y_POS");
        }
    }
    
    tryBottom(box1, box2){
        let ray1 = new THREE.Raycaster();
        let pos1 = box1.mesh.position.clone();
        /*move ray to top of box for better detection*/
        pos1.setY(pos1.y + box1.height/2);
        /*move rays to sides*/
        pos1.setX(pos1.x - box1.width/2)
        let pos2 = pos1.clone();
        pos2.setX(pos2.x + box1.width);
        let v = new THREE.Vector3(0,-1,0);
        ray1.set(pos1, v);
        let ray2 = new THREE.Raycaster(pos2, v);
        let c1 = ray1.intersectObject(box2.mesh);
        let c2 = ray2.intersectObject(box2.mesh);
        if((c1.length > 0 && c1[0].distance <= box1.height) || (c2.length > 0 && c2[0].distance <= box1.height)){
            box1.y = box2.y + box2.height;
            this.jumping = false;
            this.player.velocity.y = Math.max(0, this.player.velocity.y);
            console.log("Y_NEG");
        }
    }
    
    tryRight(box1, box2){
        let ray1 = new THREE.Raycaster();
        let pos1 = box1.mesh.position.clone();
        pos1.setX(pos1.x);
        pos1 = box1.mesh.position.clone();
        pos1.setY(pos1.y);
        let v = new THREE.Vector3(1,0,0);
        ray1.set(pos1, v);
        let collision = ray1.intersectObject(box2.mesh);
        if(collision.length > 0 && collision[0].distance <= (box1.width/2 - 0.01)){
            box1.x = box2.x - box1.width - 0.01;
            this.player.velocity.x = Math.min(0, this.player.velocity.x);
            console.log("X_POS");
        }
    }
    
    tryLeft(box1, box2){
        let ray1 = new THREE.Raycaster();
        let pos1 = box1.mesh.position.clone();
        pos1.setX(pos1.x);
        pos1 = box1.mesh.position.clone();
        pos1.setY(pos1.y);
        let v = new THREE.Vector3(-1,0,0);
        ray1.set(pos1, v);
        let collision = ray1.intersectObject(box2.mesh);
        if(collision.length > 0 && collision[0].distance <= (box1.width/2 + 0.01)){
            box1.x = box2.x + box2.width + 0.01;
            this.player.velocity.x = Math.max(0, this.player.velocity.x);
            console.log("X_NEG");
        }
    }
    
    /*input functions*/
    keyDown(e){
        var key = e.keyCode;
        switch(key){
            case 38:
                e.preventDefault();
                if(this.jumping) break;
                this.jumping = true;
                this.player.velocity.y = this.jumpVelocity;
            break;
            case 39:
                e.preventDefault();
                this.player.velocity.x = 0.05;
            break;
            case 37:
                e.preventDefault();
                this.player.velocity.x = -0.05;
            break;
        }
    }
    
    keyUp(e){
        var key = e.keyCode;
        switch(key){
            case 39:
                e.preventDefault();
                this.player.velocity.x = 0.0;
            break;
            case 37:
                e.preventDefault();
                this.player.velocity.x = 0.0;
            break;
        }
    }
}
Boxy.main();