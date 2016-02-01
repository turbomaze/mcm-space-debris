/******************\
|   Space Debris   |
|   Capture Laser  |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/31 |
\******************/

//the DebrisLaser object models laser method to remove debris
var DebrisLaser = (function() {
  /**********
   * config */

  /************
   * privates */   

  /***********
   * exports */
   var obj = function() {
     //debris laser
   }
   obj.prototype.successFunc = function(particle) {
     return .95*((100-particle.size > 0)? 1 : 0)*((1000-particle.pero > 0)? 1 : 0);
   };

   obj.prototype.runMission = function(particle,system) {
     var self = this;
     success = Math.random() <= self.successFunc(particle);
     
     if(success) {
       // remove the particle from the system
       system.particles = system.particles.filter(function(sys_particle){
           return sys_particle.id !== particle.id;
       });
       // simulate possibility that success creates new debris particles 
       new_particles_created = Math.random() <= 1/3; 
       if(new_particles_created) {
         for(var i = 0; i < 10; i++){
           system.particles.push(new DebrisParticle(
             .1*particle.size, particle.tumble, particle.apo, 
             particle.pero, particle.angle, particle.a, particle.b
           ));
         }
       }
     } else {
       // failure always results in new debris particles
       for(var i = 0; i < 10; i++){
         system.particles.push(new DebrisParticle(
           .1*particle.size, particle.tumble, particle.apo, 
           particle.pero, particle.angle, particle.a, particle.b
         ));
       }
     }


   }
})();
