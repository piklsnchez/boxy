"use strict"
const limit = 100;
const freq = 2;
const yStep = 0.9;
const duration = window.innerHeight;
const tangentSpacing = 10;
const tangentLength = 20;
const totalSteps = 900;

class Tangent {
    constructor(){
        let canvas    = document.createElement("canvas");
        canvas.height = duration;
        canvas.width  = window.innerWidth;
        document.getElementsByTagName("body")[0].appendChild(canvas);
        this.ctx      = canvas.getContext("2d");
    }
    
    static main(){
        let t = new Tangent();
        //draw curve
        t.ctx.strokeStyle = "black";
        t.ctx.lineWidth = 1;
        t.ctx.beginPath();
        for(let i = 0; i < totalSteps; i++){
            let y = i * yStep;
            let x = t.f(y);
            t.ctx.lineTo(x, y);
        }
        t.ctx.stroke();
        //draw tangent lines
        t.ctx.strokeStyle = "red";
        t.ctx.lineWidth = 0.5;
        t.ctx.beginPath();
        for(let i = 0; i < totalSteps; i += tangentSpacing){
            let y = i * yStep;
            let x = t.f(y);
            let deltaY =   (((i + 1) * yStep) - y);
            let deltaX = t.f((i + 1) * yStep) - x;
            t.ctx.moveTo((tangentLength *  deltaX) + x, (tangentLength *  deltaY) + y);
            t.ctx.lineTo((tangentLength * -deltaX) + x, (tangentLength * -deltaY) + y);
        }
        t.ctx.stroke();
    }
    
    f(y){
        return limit + 20 + limit * Math.sin(this.degToRad(y * 1.5));
    }
    
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
}
Tangent.main();