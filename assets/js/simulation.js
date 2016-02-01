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
  var N = 1000;
  var TOTAL_FUNDS = 100000;
  var START_TIME = 2016.08; //current date in years since 0
  var TIME_STEP = 0.05;
  var PROB_LAUNCH_EA_STEP = 10*TIME_STEP;
  var SAVE_EVERY = 20;

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

    runExperiment(2000, function(data) {
      console.log(data); 
    });
	}

  function runExperiment(numSteps, cb, data) {
    if (numSteps === 0) return cb(data);
    data = arguments.length === 2 ? [] : data;
    var ret = step();
    if (ret.length > 0) data.push(ret);

    setTimeout(function() {
      runExperiment(numSteps - 1, cb, data);
    }, 3);
  }

	function step() {
    //update the display
    $s('#time').innerHTML = round(t, 2); 
    var ret = [];
    if (steps % SAVE_EVERY === 0) ret = getUpdatedCounts();

    //run missions
    while (removalCampaign.missionQueue.length > 0 &&
           removalCampaign.missionQueue[0].when <= t) {
      removalCampaign.runNextMission();
    }

    //update orbit decays
    var oidx = 0;
    var particlesToUpdate = [];
    while (oidx < 5000 &&
           oidx < removalCampaign.debSys.particlesArrDeorbit.length &&
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

    //account for launches
    if (Math.random() < PROB_LAUNCH_EA_STEP) {
      removalCampaign.debSys.addParticlesFromLaunch();
    }

    //advance time and call next one
    t += TIME_STEP;
    steps++;
    return ret;
	}

  function getUpdatedCounts() {
    var leo = 0, meo = 0, geo = 0, xo = 0;
    var totalRisk = 0;
    removalCampaign.debSys.particlesArrRisk.forEach(function(particle) {
      totalRisk += particle.risk;
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
    $s('#risk').innerHTML = totalRisk.toExponential(); 
    return [totalRisk, leo, meo, geo, xo];
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
