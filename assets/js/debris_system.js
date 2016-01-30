/******************\
|   Space Debris   |
|      System      |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/30 |
\******************/

//the DebrisSystem object models collections of particles
var DebrisSystem = (function() {
  /**********
   * config */
  var TIME_CONST = 0.1;

  /************
   * privates */

  /***********
   * exports */
  var obj = function(angleDist, altDist, incDist, sizeDist, N) {
    this.angleDist = angleDist; //where in its orbit particles are at t=0 
    this.altDist = altDist; //particle distance from surface
    this.incDist = incDist; //inclination from equatorial plane
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
      var inc = this.incDist.sample();
      var a = [1, 0, 0]; //axis 1
      var b = [
        0, Math.cos((180/Math.PI)*inc), Math.sin((180/Math.PI)*inc)
      ]; //axis 2
 
      //add the particle
      this.particles.push(new DebrisParticle(
        size, tumble, alt, angle, a, b
      ));
    }

    this.update();
  };

  //step the simulation one time-step
  obj.prototype.update = function() {
    this.t++;

    var self = this;
    this.particles.forEach(function(particle) {
      particle.pos = self.getParticleLoc(particle);
    });
  };

  //get the location of a particle at the given time
  obj.prototype.getParticleLoc = function(particle) {
    var speed = Math.sqrt(1/particle.alt);
    var T = speed*TIME_CONST*this.t;
    var cosAngT = Math.cos(particle.angle + T);
    var sinAngT = Math.sin(particle.angle + T);
    var x = particle.alt*particle.a[0]*cosAngT +
            particle.alt*particle.b[0]*sinAngT;
    var y = particle.alt*particle.a[1]*cosAngT +
            particle.alt*particle.b[1]*sinAngT;
    var z = particle.alt*particle.a[2]*cosAngT +
            particle.alt*particle.b[2]*sinAngT;
    return [x, y, z];
  };

  return obj;
})();










