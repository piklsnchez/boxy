"use strict"
class Util {
    static format(){
        let args = Array.prototype.slice.call(arguments);
        let s = args.shift();
        return s.replace(/%s/g, function(){return args.shift()});
    }
    
    static degToRad(deg) {
        return deg * Math.PI / 180;
    }
    
    static getX(box){
        return (box.position.x - box.geometry.parameters.width/2);
    }
    
    static getY(box){
        return (box.position.y - box.geometry.parameters.height/2);
    }
    
    static slope(point1, point2){
        return (point1.y - point2.y) / (point1.x - point2.x);
    }
    
    static segLength(point1, point2){
        let y = Math.abs(point1.y - point2.y);
        let x = Math.abs(point1.x - point2.x);
        return Math.sqrt((y*y) + (x*x));
    }
    
      /**
       * Mozilla
       * Decimal adjustment of a number.
       *
       * @param {String}  type  The type of adjustment.
       * @param {Number}  value The number.
       * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
       * @returns {Number} The adjusted value.
       */
      static decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
    
      // Decimal round
    static round(value, exp) {
          return Util.decimalAdjust('round', value, exp);
    }
      // Decimal floor
    static floor(value, exp) {
          return Util.decimalAdjust('floor', value, exp);
    }
      // Decimal ceil
    static ceil(value, exp) {
          return Util.decimalAdjust('ceil', value, exp);
    }
}