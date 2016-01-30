/******************\
|   Space Debris   |
|   Visualization  |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/28 |
\******************/

//the DebrisVis module visualizes DebrisSystems
var DebrisVis = (function() {
  /**********
   * config */
  var DIMS = [800, 600]; //canvas dimensions in pixels
  var N = 20; //number of particles

  /************
   * privates */
  var canvas, ctx;
  var system;
  var globalTime;

  /******************
   * work functions */
  function initDebrisVis() {
    canvas = $s('#canvas');
    canvas.width = DIMS[0];
    canvas.height = DIMS[1];
    ctx = canvas.getContext('2d');

    //set up the system
    system = new DebrisSystem(
      new Distribution([0, 2*Math.PI], [1]), //angle offset in radians
      new Distribution([10, 100], [1]), //altitude in km
      new Distribution([1, 10, 100], [0.9, 0.1]), //size in cm
      N //number of particles
    );

    render();
  }

  function render() {
    Crush.clear(ctx, 'black'); 

    system.particles.forEach(function(particle) {
      var shifted = [
          particle.pos[0] + DIMS[0]/2,
          particle.pos[1] + DIMS[1]/2,
          particle.pos[2]
        ];
      Crush.drawPoint(ctx, shifted, particle.size, 'white');
    });

    system.update();
    requestAnimationFrame(render);
  }
  

  /***********
   * helpers */
  function $s(sel) {
    return document.querySelector(sel);
  }

  /***********
   * objects */

  return { //return public functions
    init: initDebrisVis
  };
})();

window.addEventListener('load', DebrisVis.init);
