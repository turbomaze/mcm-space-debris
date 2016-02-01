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
    this.rate = Math.sqrt(lx*lx + ly*ly + lz*lz);
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
  var obj = function(size, tumble, apo, pero, angle, a, b) {
    var computedMass = (4*Math.PI*Math.pow(size,3)*.1641*0.001)/3;
    this.id = Math.random().toString(36);
    this.size = size; //radius of particle in cm
    this.mass = computedMass; // mass of particle in kg
    this.tumble = tumble;
    this.apo = apo; //altitude at apogee
    this.pero = pero; //altitude at perogee
    this.angle = angle; //angle of particle
    this.a = a; //axis 1 of orbit
    this.b = b; //axis 2 of orbit
    this.pos = [0, 0, 0]; // stores coords of particle at any moment
    this.risk = function(band_particles) {
      var speed = 2; //todo
      var average_mass = 0;
      band = (this.pero === 35786)? "GEO" : (this.pero >= 2000)? "MEO" : "LEO";
      band_volume = 4*Math.PI/3 * ((band === "GEO")? 1 : (band === "MEO")? 35786^3-2000^3 : 2000^3-160^3); //km^3
      for(var i = 0; i < band_particles.length; i++) {
        average_mass += band_particles[i].mass;
      }
      average_mass = average_mass/band_particles.length;
      return (this.mass*speed^2/average_mass)*this.size^2*Math.sqrt(length(band_particles)/band_volume);
    };
  };

  return obj;
})();
