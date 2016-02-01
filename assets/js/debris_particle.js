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
  var obj = function(size, mass = (4*Math.PI*size^3*.1641*10^-3)/3, tumble, apo, pero, angle, a, b) {
    this.id = Math.random().toString(36);
    this.size = size; //radius of particle in cm
    this.mass = mass; // mass of particle in kg
    this.tumble = tumble;
    this.apo = apo; //altitude at apogee 
    this.pero = pero; //altitude at perogee 
    this.angle = angle; //angle of particle
    this.a = a; //axis 1 of orbit 
    this.b = b; //axis 2 of orbit 
    this.pos = [0, 0, 0]; // stores coords of particle at any moment
    this.risk = function(band_particles) {
      speed = Math.PI*(3*(this.a+this.b)-Math.sqrt((3*this.a+this.b)*(this.a+3*this.b))
      average_mass = 0;
      band = (this.pero === 35786)? "GEO" : (this.pero >= 2000)? "MEO" : "LEO";
      band_volume = 4*Math.PI/3 * ((band === "GEO")? 1 : (band === "MEO")? 35786^3-2000^3 : 2000^3-160^3); //km^3
      for(i = 0; i < band_particles.length; i++):
        average_mass += band_particles[i].mass;
      average_mass = average_mass/band_particles.length;
      return (this.mass*speed^2/average_mass)*this.size^2*Math.sqrt(length(band_particles)/band_volume);
    }
  };

  return obj;
})();
