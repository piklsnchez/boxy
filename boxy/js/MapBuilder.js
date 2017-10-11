"use strict";
class MapBuilder {
    constructor(){}
    
    static fetchMap(fileName, boxy){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", fileName, true);
        xhr.onload = function(){
            let mapTxt = xhr.responseText;
            let x = -5.0;
            let y = 5.0;
            let boxes = mapTxt.split("").map(function(c){
                if(c === "x"){
                    x += 1.0;
                    return new Box(1,1,1,0xffffff, new THREE.Vector3(x,y,0));
                } else if(c === "p"){
                    x += 1.0;
                    return new Player(0.9,0.9,0.9,0x1111ff, new THREE.Vector3(x,y,0));
                } else if(c === "\n"){
                    x = -5.0;
                    y -= 1.0;
                    return null;
                } else {
                    x += 1.0;
                    return null;
                }
            }).filter(function(b){
                return b !== null;
            });
            boxy.loadMap(boxes);
        }
        xhr.onerror = function(){
            console.log("error");
        }
        xhr.send();
    }
}