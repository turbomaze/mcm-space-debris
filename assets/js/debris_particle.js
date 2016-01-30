/******************\
|   Space Debris   |
|     Particle     |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/30 |
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
  var obj = function(size, tumble, alt, angle, a, b) {
    this.id = Math.random().toString(36);
    this.size = size;
    this.tumble = tumble;
    this.alt = alt; //altitude of particle
    this.angle = angle; //angle of particle
    this.a = a; //axis 1 of orbit 
    this.b = b; //axis 2 of orbit 
    this.pos = [0, 0, 0]; // stores coords of particle at any moment
  };

  return obj;
})();
