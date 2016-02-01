/******************\
|   Space Debris   |
|    Simulation    |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/30 |
\******************/

//the Simulation modules combines ADR methods with modeled debris system
var Simulation = (function() {
  /**********
   * config */
  var N = 10000; //number of particles to start
  var ALT_START = 6000; //radius of earth basically
  var EXPLOSION_PARAM = 1/365;
  var EXPLOSION_GEN = [157, 961, 119]; // number of particles generated in each

  /************
   * privates */
  var sys_time = 0;
  var scheduled = [];

  /******************
   * work functions */
  function initSimulation() {
    next_time = -Math.log(1.0-Math.random))/EXPLOSION_PARAM; // number of days until next explosion
    scheduled.push([sys_time + Math.ceil(next_time),"EXPLOSION"]);
  }
  function runSimulation() {
    system = new DebrisSystem(
      ALT_START,
      new Distribution([0, 2*Math.PI], [1]), //angle offset in radians
      new Distribution([100, 1000], [1]), //altitude in km
      new Distribution([
        0, 20, 40, 60, 80, 100, 140
      ], [
        80, 50, 20, 200, 150, 10
      ]), //inclination in deg
      new Distribution([
        0.1, 1, 10, 20
      ], [
        0.9967, 0.0031, 0.0002
      ]), //size in cm
      N //number of particles
    );
    system = new DebrisSystem(ALT_START);

    //check for scheduled events
    for(var i = 0; i < scheduled.length; i++) {
      if(sys_time != scheduled[i][0]) { continue; }
      switch(scheduled[i][1]) {
        case "EXPLOSION":
          // create new particles from explosion based on distribution from Rossi et al.
          sizeDist = new Distribution([.0001, .01, .1, .2],[.1269, .7769, .0962]);
          for(int j = 0; j < EXPLOSION_GEN[i]; j++) {
              inc = new Distribution([
              0, 20, 40, 60, 80, 100, 140], [
                80, 50, 20, 200, 150, 10]).sample();
              system.particles.push(new DebrisParticle(
              sizeDist.sample(), new Tumble(0,0,0), 800,
              800, new Distribution([0, 2*Math.PI], [1]).sample(), [1, 0, 0],[
              0, Math.cos((180/Math.PI)*inc), Math.sin((180/Math.PI)*inc)]
            ));
          }

          //schedule the next explosion
          next_time = -Math.log(1.0-Math.random))/EXPLOSION_PARAM; // number of days until next explosion
          scheduled.push([sys_time + Math.ceil(next_time),"EXPLOSION"]);
        case "ARM":
          arm = new DebrisArm();
          arm.runMission(scheduled[i][2],system);
        case "LASER"
          laser = new DebrisLaser();
          laser.runMission(scheduled[i][2],system);
      }
    }

    //natural collisions/decay

  }
})();
