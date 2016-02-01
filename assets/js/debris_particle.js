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

  /************
   * privates */

  /***********
   * exports */
  var obj = function(pero, size, mass, deorbit, tumbleRate) {
    this.id = Math.random().toString(36);
    this.pero = pero; //perogee
    this.bin = this.pero < 2000 ? LEO : (
      pero < 35700 ? MEO : (pero > 35700 && pero < 35900 ? GEO : XO) 
    );
    this.size = size; //cross sectional area
    this.mass = mass;
    this.deorbit = deorbit; //when this particle started
    this.tumbleRate = tumbleRate;

    this.targetted = false; //scheduled for removal?
		this.risk = Math.random(); //how risky it is
  };

  return obj;
})();
