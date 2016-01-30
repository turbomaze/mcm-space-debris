/******************\
|   Space Debris   |
|     Particle     |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/28 |
\******************/

//the Tumble object describes how a particle is tumbling
var Tumble = (function() {
  var obj = function(lx, ly, lz) { //angular momentum in x,y,z
    this.L = {x: lx, y: ly, z: lz}; 
  };

  return obj;
})();

//the DebrisParticle object models a debris particle
var DebrisParticle = (function() {
  /**********
   * config */

  /************
   * privates */

  /***********
   * exports */
  var obj = function(size, tumble, positionFunc) {
    this.id = Math.random().toString(36);
    this.size = size;
    this.tumble = tumble;
    this.r = positionFunc;
  };

  return obj;
})();
