/******************\
|   Space Debris   |
|      System      |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/28 |
\******************/

//the DebrisSystem object models collections of particles
var DebrisSystem = (function() {
  /**********
   * config */

  /************
   * privates */

  /***********
   * exports */
  var obj = function(angleDist, altDist, sizeDist, N) {
    this.angleDist = angleDist; //where in its orbit particles are at t=0 
    this.altDist = altDist; //particle distance from surface
    this.sizeDist = sizeDist; //particle size
    this.N = N; //how many particles there are

    //get the particles
    this.particles = [];
    for (var ai = 0; ai < this.N; ai++) {
      //get particle properties
      var size = this.sizeDist.sample();
      var tumble = new Tumble(0, 0, 0);
      var angle = this.angleDist.sample();
      var alt = this.altDist.sample();
      var a = [1, 0, 0]; //axis 1
      var b = [0, 1, 0]; //axis 2
 
      //add the particle
      this.particles.push(new DebrisParticle(
        size, tumble, function positionFunc(t) {
          var x = alt*a[0]*Math.cos(angle+0.01*t) + alt*b[0]*Math.sin(angle+0.01*t);
          var y = alt*a[1]*Math.cos(angle+0.01*t) + alt*b[1]*Math.sin(angle+0.01*t);
          var z = alt*a[2]*Math.cos(angle+0.01*t) + alt*b[2]*Math.sin(angle+0.01*t);
          return [x, y, z];
        }
      ));
    }
  };

  return obj;
})();
