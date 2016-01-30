/******************\
|   Space Debris   |
|      System      |
| @author Anthony  |
| @author Jessy    |
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
    this.t = 0; //internal time

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
        size, tumble, (function(c1,c2) {
          return function positionFunc(t) {
            var x = c1*a[0]*Math.cos(c2+0.01*t) + c1*b[0]*Math.sin(c2+0.01*t);
            var y = c1*a[1]*Math.cos(c2+0.01*t) + c1*b[1]*Math.sin(c2+0.01*t);
            var z = c1*a[2]*Math.cos(c2+0.01*t) + c1*b[2]*Math.sin(c2+0.01*t);
            return [x, y, z];
          };
        })(alt, angle)
      ));
    }
  };

  //step the simulation one time-step
  obj.prototype.update = function() {
    this.t++;
    var self = this;
    this.particles.forEach(function(particle) {
      particle.pos = particle.r(self.t);
    });
  };
  return obj;
})();










