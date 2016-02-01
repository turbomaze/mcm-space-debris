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
  var MASS_SIZE_RATIO = 1;

  /************
   * privates */

  /***********
   * exports */
  var obj = function(bin, mass, birth, tumbleRate) {
    this.id = Math.random().toString(36);
    this.bin = bin; //leo, meo, geo
    this.mass = mass;
    this.size = this.mass/MASS_SIZE_RATIO;
    this.birth = birth; //when this particle started
    this.tumbleRate = tumbleRate;

    this.targetted = false; //scheduled for removal?
		this.risk = Math.random(); //how risky it is
  };
  obj.prototype.decayOrbit = function() {
    this.bin--;
  };

  return obj;
})();
