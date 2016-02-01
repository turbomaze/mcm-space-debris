/******************\
|   Space Debris   |
|   Debris System  |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/31 |
| @edit 2016/01/31 |
\******************/

var DebrisSystem = (function() {
  /**********
   * config */

  /*************
   * constants */
  var MASS_SIZE_RATIO = 62;
  var MASS_SIZE_COEFF = 1.13;
  var DEORBIT_PARAMS = [
    [],
    [],
    [0.05612, -0.7361, 0.2233, -141.2 ], //200km
    [1.471,   -135.6,  0.1199, -0.5947], //300km
    [4.056,   -112.5,  0.3533, -1.121 ], //400km
    [3.149,   -27.57,  0.556,  -0.85  ], //500km
    [62.62,   -260.6,  4.453,  -5.408 ], //600km
    [36.56,   -71.91,  4.36,   -1.801 ], //700km
    [52.21,   -45.52,  6.93,   -1.4   ], //800km
    [60.37,   -27.12,  10.42,  -1.123 ]  //900km
  ];

  /************
   * privates */
  function getIdxInArr(arr, needle, cmpFunc) {
    var min = 0, max = arr.length - 1;
    while (min <= max) {
      var mid = (min + max) >> 1;
      var val = arr[mid];
      var cmp = cmpFunc(needle, val);
      if (cmp < 0) {
        max = mid - 1;
      } else if (cmp > 0) {
        min = mid + 1;
      } else {
        return mid;
      }
    }

    return -min - 1;
  }

  function riskCmp(a, b) {
    if (!a || !b) return -1;
    if (a.risk !== b.risk) return a.risk - b.risk;
    else {
      return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
    }
  }

  function deorbitCmp(a, b) {
    if (a.deorbit !== b.deorbit) return a.deorbit - b.deorbit;
    else {
      return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
    }
  }

  function getDeorbitTime(size, mass, alt) {
    function doubleExp(ps, samr) {
      return ps[0]*Math.exp(ps[1]*samr) + ps[2]*Math.exp(ps[3]*samr);
    }
    
    if (alt < 200) return 0.1; 
    else if (alt < 900) {
      var pl = DEORBIT_PARAMS[Math.floor(alt/100)];
      var pg = DEORBIT_PARAMS[Math.floor(alt/100)+1];
      var samr = 4*size/mass;
      var g1 = doubleExp(pl, samr);
      var g2 = doubleExp(pg, samr);
      var pct = (alt % 100)/100;
      return pct*g1 + (1 - pct)*g2;
    } else {
      return Math.pow(10, 7); //arbitrarily long
    } 
  }

  function getParticleRisk(MBars, particle) {
    var rho = function(alt) {
      return 0.0062*Math.pow(alt, -2.223);
    };
    
    var risk = Math.pow(Math.sqrt(particle.size/Math.PI), 6.52);
    risk *= Math.sqrt(rho(particle.alt))/MBars[particle.bin];
    risk /= particle.alt;
    return risk;
  }

  function assignRisk(particles) {
    var leoMassAvg = 0;
    var leoCount = 0;
    var meoMassAvg = 0;
    var meoCount = 0;
    var geoMassAvg = 0;
    var geoCount = 0;
    var xoMassAvg = 0;
    var xoCount = 0;
    particles.forEach(function(particle) {
      switch(particle.bin) {
        case 0:
          leoMassAvg += particle.mass;
          leoCount++;
          break;
        case 1:
          meoMassAvg += particle.mass;
          meoCount++;
          break;
        case 2:
          geoMassAvg += particle.mass;
          geoCount++;
          break;
        case 3:
          xoMassAvg += particle.mass;
          xoCount++;
          break;
      }
    });
    leoMassAvg /= leoCount;
    meoMassAvg /= meoCount;
    geoMassAvg /= geoCount;
    xoMassAvg /= xoCount;
    var Mbars = [leoMassAvg, meoMassAvg, geoMassAvg, xoMassAvg];
    particles.forEach(function(particle) {
      particle.risk = getParticleRisk(Mbars, particle);
    });
    return Mbars;
  }

  /***********
   * exports */
  var obj = function(N, startTime) {
    this.t = startTime;
    this.particlesArrRisk = [];
    this.particlesArrDeorbit = [];
    this.particlesObj = {};
    this.massAvgs = [];

    if (N === true) { //use real data
      var self = this;
      debParticles.forEach(function(particle, idx) {
        var tumbleRate = 0;
        var pero = particle['perogeeAlt'];
        var apo = particle['apogeeAlt'];
        var alt = pero;
        var rb = new Date();
        var size = particle['radarCross'];
        if (size === 0.000001) return; //skip these

        var mass = Math.pow(size, MASS_SIZE_COEFF)*MASS_SIZE_RATIO;
        var deorbit = rb.getFullYear() + (rb.getMonth()+rb.getDate()/30)/12;
        deorbit += getDeorbitTime(size, mass, alt);
        var particle = new DebrisParticle(
          alt, size, mass, deorbit, tumbleRate
        ); 
        
        self.particlesArrRisk.push(particle);
        self.particlesArrDeorbit.push(particle);
        self.particlesObj[particle.id] = particle;
      });     
      this.massAvgs = assignRisk(this.particlesArrRisk);
    } else { //generate data
      for (var ai = 0; ai < N; ai++) {
		  	var particle = new DebrisParticle(
          0, 0, 0, Math.random(), 0
        );
		  	this.particlesArrRisk.push(particle);
		  	this.particlesArrDeorbit.push(particle);
		  	this.particlesObj[particle.id] = particle;
      }
    }

    //sort
    this.particlesArrRisk.sort(riskCmp);
    this.particlesArrDeorbit.sort(deorbitCmp);
  };
  obj.prototype.getIdxInRisk = function(particle) {
    return getIdxInArr(this.particlesArrRisk, particle, riskCmp);
  };
  obj.prototype.getIdxInDeorbit = function(particle) {
    return getIdxInArr(this.particlesArrDeorbit, particle, deorbitCmp);
  };
	obj.prototype.addParticle = function(particle) {
	  var idxRisk = 1-this.getIdxInRisk(particle); //minus cuz it's not in there
	  var idxDeorbit = 1-this.getIdxInDeorbit(particle);
    this.particlesArrRisk.splice(idxRisk, 0, particle);
    this.particlesArrDeorbit.splice(idxDeorbit, 0, particle);
    this.particlesObj[particle.id] = particle;

    particle.risk = getParticleRisk(this.massAvgs, particle);
	};
  obj.prototype.removeParticle = function(particle) {
	  var idxRisk = this.getIdxInRisk(particle);
	  var idxDeorbit = this.getIdxInDeorbit(particle);
    if (idxRisk < 0 || idxDeorbit < 0) return;

    this.particlesArrRisk.splice(idxRisk, 1);
    this.particlesArrDeorbit.splice(idxDeorbit, 1);
    delete this.particlesObj[particle.id];
  };
  obj.prototype.deorbit = function(particle) {
    this.removeParticle(particle);
  };

  return obj;
})();
