/******************\
|   Space Debris   |
|  Debris Particle |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/31 |
| @edit 2016/01/31 |
\******************/

var DebrisParticle = (function() {
  /**********
   * config */

  /*************
   * constants */
  var LEO = 0, MEO = 1, GEO = 2, XO = 3;
  Math.seedrandom('hello.');

  /************
   * privates */

  /***********
   * exports */
  var obj = function(alt, size, mass, deorbit, tumbleRate) {
    this.id = Math.random().toString(36);
    this.alt = alt; //average of apo and pero
    this.bin = this.alt < 2000 ? LEO : (
      alt < 35700 ? MEO : (alt > 35700 && alt < 35900 ? GEO : XO) 
    );
    this.size = size; //cross sectional area
    this.mass = mass;
    this.deorbit = deorbit; //when this particle started
    this.tumbleRate = tumbleRate;

    this.targetted = false; //scheduled for removal?
		this.risk = 0; //how dangerous it is
  };

  return obj;
})();
