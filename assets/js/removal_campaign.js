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
    massInSpace: 200,

    unitCost: 30000000,

    sizeCost: 0, //per cm

    successfulCapture: function(particle) {
      var grapple = particle.size >= .7;
      return 0.95*(+grapple)*Math.pow((1-0.16), ((particle.tumbleRate-3 > 0) ? 1 : 0));
    },

    success: {
      getPartDeorbitTime: function(particle) {
        return 0;
      }
    },

    fail: {
      getMassDistSelf: function(selfMass) {
        var dist = new Distribution([selfMass, selfMass], [1]); 
        return dist;
      },

      getMassDistDeb: function(particle) {
        var dist = new Distribution([particle.mass, particle.mass], [1]); 
        return dist;
      }
    }
  },
  
  "RemovalLaser": {
    massInSpace: 0,

    unitCost: 0,

    sizeCost: 20000, //per cm diameter target

    successfulCapture: function(particle) {
      return .95*((100-particle.mass > 0)? 1 : 0)*(particle.size > 0.0001 ? 1 : 0)*((1000-particle.alt> 0)? 1 : 0);
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
        var dist = new Distribution(function(x) {
          return Math.pow(Math.log((-1/0.2) * (x-1))*(-1/0.65), 2); 
        }); 
        return dist;
      }
    }
  }
};

var RemovalCampaign = (function() {
  /**********
   * config */

  /*************
   * constants */
  Math.seedrandom('hello.');

  /************
   * privates */

  /***********
   * exports */
  var obj = function(debSys) {
		this.debSys = debSys;
		this.missionQueue = [];
  };
  obj.prototype.getBestParticleToRemove = function(type) {
    var idx = 0;
    while (this.debSys.particlesArrCap[type][idx].targetted) {
      idx++; 
      if (idx >= this.debSys.particlesArrCap[type].length) return false;
    }
    return this.debSys.particlesArrCap[type][idx];
  };
  obj.prototype.useFunds = function(startTime, funds) {
    var type = 'DebrisArm';
    var ai = 0;
    while (funds > 0) {
      var particle = this.getBestParticleToRemove(type);
      if (particle === false) return;
      console.log('Removing '+JSON.stringify(particle));
      cost = RemovalMethods[type].unitCost;
      cost += RemovalMethods[type].sizeCost*100*Math.sqrt(particle.size);
      this.scheduleRemoval(type, startTime + 0.04*ai, particle);
      funds -= cost;
      ai++;
    }
  };
	obj.prototype.scheduleRemoval = function(type, time, particle) {
    console.log(
      'Scheduled to remove particle '+particle.id+' at '+time
    );
    particle.targetted = true;
		this.missionQueue.push({type: type, when: time, pid: particle.id, risk: particle.risk});
  };
  obj.prototype.runNextMission = function() {
    var mission = this.missionQueue.shift();
    var particle = this.debSys.particlesObj[mission.pid];
    if (!particle) return;
    console.log('Running mission: '+JSON.stringify(mission));

    //remove according to type spec 
    var rmech = RemovalMethods[mission.type];
    if (Math.random() < rmech.successfulCapture(particle)) { //successful removal 
      console.log('Mission success!');
      this.debSys.removeParticle(particle);
      particle.deorbit = mission.when + rmech.success.getPartDeorbitTime(); 
      this.debSys.addParticle(particle);
    } else { //failed removal
      console.log('Mission failed.');

      //particles from the device
      var totalMassSelf = 0;
      var massDistSelf = rmech.fail.getMassDistSelf(rmech.massInSpace);
      while (totalMassSelf < 0.9*rmech.massInSpace) {
        var newMass = massDistSelf.sample();
        totalMassSelf += newMass;
        var newDebris = this.debSys.createNewParticle(
          particle.alt, newMass, particle.tumbleRate
        );
        this.debSys.addParticle(newDebris);
      }

      //particles from the debris itself
      var totalMassDeb = 0;
      var massDistDeb = rmech.fail.getMassDistDeb(particle);
      while (totalMassDeb < 0.9*particle.mass) {
        var newMass = massDistDeb.sample();
        totalMassDeb += newMass;
        var newDebris = this.debSys.createNewParticle(
          particle.alt, newMass, particle.tumbleRate
        );
        this.debSys.addParticle(newDebris);
      }
    }
  };

  return obj;
})();
