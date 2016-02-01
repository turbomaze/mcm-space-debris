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

  /*************
   * constants */
  var USE_REAL_DATA = true;

  /************
   * privates */
	var removalCampaign;
  var t, steps;

	/*********************
   * working functions */
  function initSimulation() {
    t = START_TIME, steps = 0;

		var debSys = new DebrisSystem(USE_REAL_DATA, START_TIME);
    removalCampaign = new RemovalCampaign(debSys);
    removalCampaign.useFunds(t, TOTAL_FUNDS);

		step();
	}

	function step() {
    //update the display
    $s('#time').innerHTML = round(t, 2); 
    if (steps % 10 === 0) updateCounts();

    //run missions
    while (removalCampaign.missionQueue.length > 0 &&
           removalCampaign.missionQueue[0].when <= t) {
      removalCampaign.runNextMission();
    }

    //update orbit decays
    var oidx = 0;
    var particlesToUpdate = [];
    while (oidx < removalCampaign.debSys.particlesArrDeorbit.length &&
           removalCampaign.debSys.particlesArrDeorbit[oidx].deorbit <= t) {
      particlesToUpdate.push(
        removalCampaign.debSys.particlesArrDeorbit[oidx].id
      );
      oidx++;
    }

    particlesToUpdate.forEach(function(pid) {
      var particle = removalCampaign.debSys.particlesObj[pid];
      removalCampaign.debSys.deorbit(particle);
    });

    //advance time and call next one
    t += TIME_STEP;
    steps++;
    setTimeout(step, 10);
	}

  function updateCounts() {
    var leo = 0, meo = 0, geo = 0, xo = 0;
    removalCampaign.debSys.particlesArrRisk.forEach(function(particle) {
      switch(particle.bin) {
        case 0: leo++; break;
        case 1: meo++; break;
        case 2: geo++; break;
        case 3: xo++; break;
      }
    });
    $s('#leo').innerHTML = leo; 
    $s('#meo').innerHTML = meo; 
    $s('#geo').innerHTML = geo; 
    $s('#xo').innerHTML = xo; 
  }

  /***********
   * helpers */
  function round(n, places) {
    var f = Math.pow(10, places);
    return Math.round(n*f)/f;
  }

  function $s(sel) {
    return document.querySelector(sel);
  }

  /***********
   * exports */
	return {
		init: initSimulation
  };
})();

window.addEventListener('load', Simulation.init);
