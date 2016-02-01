/******************\
|   Space Debris   |
|   Capture Arm    |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/31 |
\******************/

//the DebrisArm object models arm method to remove debris
var DebrisArm = (function() {
  /**********
   * config */

  /************
   * privates */

  /***********
   * exports */
   var obj = function() {
     //debris arm object
   }
   obj.prototype.successFunc = function(particle) {
      var grapple = particle.size >= .7;
      return .95*(+grapple)*Math.pow((1-.16), ((particle.tumble.rate-3 > 0) ? 1 : 0))*Math.pow(.5,particle.size/250);
   };

   obj.prototype.runMission = function(particle,system) {
        var self = this;
        success = Math.random() <= self.successFunc(particle);

        if(success) {
            // remove the particle from the system
            system.particles = system.particles.filter(function(sys_particle){
                return sys_particle.id !== particle.id;
            });
        } else {
            reuse = Math.random() <= self.successFunc(particle)/1.05
            // simulate possibility that the arm will become unusable and
            //  turn into a new debris particle
            if(!reuse) {
                system.particles.push(new DebrisParticle(
                  .66, particle.tumble, particle.apo, particle.pero,
                  particle.angle, particle.a, particle.b
                ));
            }
        }
   }
})();
