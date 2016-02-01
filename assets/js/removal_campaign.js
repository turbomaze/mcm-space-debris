/******************\
|   Space Debris   |
| Removal Campaign |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/31 |
| @edit 2016/01/31 |
\******************/

var RemovalMethods = {
  "DebrisArm": {
    massInSpace: 10,

    successfulCapture: function(particle) {
      var grapple = particle.size >= .7;
      return Math.random() < 0.95*(+grapple)*Math.pow((1-0.16), ((particle.tumbleRate-3 > 0) ? 1 : 0))*Math.pow(0.5, particle.size/250);
    },

    success: {
      getPartDeorbitTime: function(particle) {
        return 0;
      }
    },

    fail: {
      getMassDistSelf: (function(self) {
        return function() {
          var dist = new Distribution([
            self.massInSpace, self.massInSpace
          ], [1]);
          return dist;
        };
      })(this),

      getMassDistDeb: function(particle) {
        var dist = new Distribution([particle.mass, particle.mass], [1]); 
        return particle.mass;
      }
    }
  },
  
  "RemovalLaser": {
    massInSpace: 0,

    successfulCapture: function(particle) {
      return .95*((100-particle.size > 0)? 1 : 0)*((1000-particle.pero > 0)? 1 : 0);
    },

    success: {
      getPartDeorbitTime: function(particle) {
        return 0;
      }
    },

    fail: {
      getMassDistSelf: (function(self) {
        return function() {
          var dist = new Distribution([self.mass, self.mass], [1]);
          return dist;
        };
      })(this),

      getMassDistDeb: function(particle) {
        var dist = new Distribution([particle.mass, particle.mass], [1]); 
        return particle.mass;
      }
    }
  }
};

var RemovalCampaign = (function() {
  /**********
   * config */

  /************
   * privates */

  /***********
   * exports */
  var obj = function(debSys) {
		this.debSys = debSys;
		this.missionQueue = [];
  };
  obj.prototype.find = function(p) {
    return this.debSys.getIdxInRisk(p);
  }
  obj.prototype.getBestParticleToRemove = function() {
    var idx = 0;
    while (this.debSys.particlesArrRisk[idx].targetted) {
      idx++; 
      if (idx >= this.debSys.particlesArrRisk.length) return false;
    }
    return this.debSys.particlesArrRisk[idx];
  };
  obj.prototype.useFunds = function(startTime, funds) {
    for (var ai = 0; ai < 10; ai++) {
      var particle = this.getBestParticleToRemove();
      if (particle === false) return;
      this.scheduleRemoval('DebrisArm', startTime + ai*4, particle);
    }
  };
	obj.prototype.scheduleRemoval = function(type, time, particle) {
    console.log(
      'Scheduled to remove particle '+particle.id+' at '+time
    );
    particle.targetted = true;
		this.missionQueue.push({type: type, when: time, pid: particle.id});
  };
  obj.prototype.runNextMission = function() {
    var mission = this.missionQueue.shift();
    console.log('Running mission: '+JSON.stringify(mission));
    //remove according to type spec   
  };

  return obj;
})();
