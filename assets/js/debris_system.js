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
  var obj = function(altStart, angleDist, altDist, incDist, sizeDist, N) {
    this.t = 0; //internal time
    this.altStart = altStart; //radius of earth
    this.particles = [];
    this.LEO = function() {
      var self = this;
      return self.particles.filter(function(particle){
        particle.pero >= 160 && particle.pero < 2000
      });
    };
    this.MEO = function(){
      var self = this;
      return self.particles.filter(function(particle){
        particle.pero >= 2000 && particle.pero < 35786
      });
    };
    this.GEO = function(){
      var self = this;
      return self.particles.filter(function(particle){
        particle.pero === 35786
      });
    };

    //sample from given distributions
    if (arguments.length > 1) {
      this.angleDist = angleDist; //where in its orbit particles are at t=0 
      this.altDist = altDist; //particle distance from surface
      this.incDist = incDist; //inclination from equatorial plane
      this.sizeDist = sizeDist; //particle size
      this.N = N; //how many particles there are

      //get the particles
      for (var ai = 0; ai < this.N; ai++) {
        //get particle properties
        var size = this.sizeDist.sample();
        var mass = 'undefined';
        var tumble = new Tumble(0, 0, 0);
        var angle = this.angleDist.sample();
        var apo = this.altDist.sample();
        var pero = this.altDist.sample();
        var inc = this.incDist.sample();
        var a = [1, 0, 0]; //axis 1
        var b = [
          0, Math.cos((180/Math.PI)*inc), Math.sin((180/Math.PI)*inc)
        ]; //axis 2
 
        //add the particle
        this.particles.push(new DebrisParticle(
          size, mass, tumble, apo, pero, angle, a, b
        ));
      }
    } else { //use data instead of distributions
      var self = this;
      debParticles.forEach(function(particle) {
        var tumble = new Tumble(0, 0, 0);
        var inc = particle['inclination'];
        var a = [1, 0, 0]; //axis 1
        var b = [
          0, Math.cos((180/Math.PI)*inc), Math.sin((180/Math.PI)*inc)
        ]; //axis 2
        self.particles.push(
          new DebrisParticle(
            particle['radarCross'], tumble, particle['apogeeAlt'],
            particle['perogeeAlt'], 2*Math.PI*Math.random(), a, b
          )
        ); 
      });
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
    var speed = Math.sqrt(2/(particle.apo+particle.pero));
    var T = speed*TIME_CONST*this.t;
    var cosAngT = Math.cos(particle.angle + T);
    var sinAngT = Math.sin(particle.angle + T);
    var apoAndRad = particle.apo + this.altStart;
    var peroAndRad = particle.pero + this.altStart;
    var x = apoAndRad*particle.a[0]*cosAngT +
            peroAndRad*particle.b[0]*sinAngT;
    var y = apoAndRad*particle.a[1]*cosAngT +
            peroAndRad*particle.b[1]*sinAngT;
    var z = apoAndRad*particle.a[2]*cosAngT +
            peroAndRad*particle.b[2]*sinAngT;
    return [x, y, z];
  };

  return obj;
})();










