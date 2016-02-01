/******************\
|   Space Debris   |
|    Simulation    |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/31 |
| @edit 2016/01/31 |
\******************/

var Simulation = (function() {
  /**********
   * config */
  var N = 3;
  var TOTAL_FUNDS = 100000;
  var START_TIME = 2016.08; //current date in years since 0
  var TIME_STEP = 0.01;

  /************
   * privates */
	var removalCampaign;
  var t;

	/*********************
   * working functions */
  function initSimulation() {
    t = START_TIME;

		var debSys = new DebrisSystem(N, START_TIME);
    removalCampaign = new RemovalCampaign(debSys);
    removalCampaign.useFunds(t, TOTAL_FUNDS);

		step();
	}

	function step() {
    //run missions
    while (removalCampaign.missionQueue.length > 0 &&
           removalCampaign.missionQueue[0].when <= t) {
      removalCampaign.runNextMission();
    }

    //update orbit decays
    var oidx = 0;
    var particlesToUpdate = [];
    while (oidx < removalCampaign.debSys.particlesArrDeorbit.length &&
           removalCampaign.debSys.particlesArrDeorbit[oidx].birth <= t) {
      particlesToUpdate.push(
        removalCampaign.debSys.particlesArrDeorbit[oidx].id
      );
      oidx++;
    }
    particlesToUpdate.forEach(function(pid) {
      var particle = removalCampaign.debSys.particlesObj[pid];
      removalCampaign.debSys.decayOrbit(particle);
    });

    //advance time and call next one
    t += TIME_STEP;
    setTimeout(step, 10);
	}

  /***********
   * exports */
	return {
		init: initSimulation
  };
})();

window.addEventListener('load', Simulation.init);
