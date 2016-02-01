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

  /************
   * privates */
  function getIdxInArr(arr, needle, cmpFunc) {
    var min = 0, max = arr.length - 1;
    while (min <= max) {
      var mid = (min + max) >> 1;
      var val = arr[mid];
      var cmp = cmpFunc(val, needle);
      if (cmp < 0) {
        max = mid - 1;
      } else if (cmp > 0) {
        min = mid + 1;
      } else {
        return mid;
      }
    }

    return -min - 1;
  };

  function riskCmp(a, b) {
    if (a.risk !== b.risk) return a.risk - b.risk;
    else {
      return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
    }
  }

  function deorbitCmp(a, b) {
    if (a.birth !== b.birth) return a.birth - b.birth;
    else {
      return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
    }
  }


  /***********
   * exports */
  var obj = function(N, startTime) {
    this.t = startTime;
    this.particlesArrRisk = [];
    this.particlesArrDeorbit = [];
    this.particlesObj = {};

    for (var ai = 0; ai < N; ai++) {
			var particle = new DebrisParticle(
        0, 0, Math.random(), 0
      );
			this.particlesArrRisk.push(particle);
			this.particlesObj[particle.id] = particle;
    }
    this.particlesArrDeorbit = this.particlesArrRisk.slice(0);

    //sort
    this.particlesArrRisk.sort(riskCmp);
    this.particlesArrDeorbit.sort(deorbitCmp);
  };
  obj.prototype.getIdxInRisk = function(particle) {
    return getIdxInArr(this.particlesArrRisk, particle.risk, riskCmp);
  };
  obj.prototype.getIdxInDeorbit = function(particle) {
    return getIdxInArr(this.particlesArrDeorbit, particle.birth, deorbitCmp);
  };
	obj.prototype.addParticle = function(particle) {
	  var idxRisk = -this.getIdxInRisk(particle); //neg because it's not in there
	  var idxDeorbit = -this.getIdxInDeorbit(particle);
    this.particlesArrRisk.splice(idxRisk, 0, particle);
    this.particlesArrDeorbit.splice(idxDeorbit, 0, particle);
    this.particlesObj[particle.id] = particle;
	};
  obj.prototype.removeParticle = function(particle) {
	  var idxRisk = this.getIdxInRisk(particle);
	  var idxDeorbit = this.getIdxInDeorbit(particle);
    if (idxRisk < 0 || idxDeorbit) return;

    this.particlesArrRisk.splice(idxRisk, 1);
    this.particlesArrDeorbit.splice(idxDeorbit, 1);
    delete this.particlesObj[particle.id];
  };
  obj.prototype.decayOrbit = function(particle) {
    this.removeParticle(particle);
    particle.decayOrbit();
    if (particle.bin >= 0) this.addParticle(particle);
  };

  return obj;
})();
