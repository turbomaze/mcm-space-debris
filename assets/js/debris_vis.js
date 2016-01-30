/******************\
|   Space Debris   |
|   Visualization  |
| @author Anthony  |
| @author Jessy    |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/30 |
\******************/

//the DebrisVis module visualizes DebrisSystems
var DebrisVis = (function() {
  /**********
   * config */
  var DIMS = [400, 400]; //canvas dimensions in pixels
  var N = 10000; //number of particles
  var RENDER_EVERY = 5; //render every this many particles
  var PART_COL = 'rgba(255,255,255,0.6)'; //color of the particles
  var SIZE_SCALE = 2; //pixel to log particle size coeff

  /************
   * privates */
  var canvases, ctxs;
  var system;
  var globalTime;

  /******************
   * work functions */
  function initDebrisVis() {
    canvases = [], ctxs = [];
    for (var ai = 0; ai < 3; ai++) {
      canvases.push($s('#canvas'+ai));
      canvases[ai].width = DIMS[0];
      canvases[ai].height = DIMS[1];
      ctxs[ai] = canvases[ai].getContext('2d');
    }

    //set up the system
    system = new DebrisSystem(
      new Distribution([0, 2*Math.PI], [1]), //angle offset in radians
      new Distribution([10, 200], [1]), //altitude in km
      new Distribution([
        0, 20, 40, 60, 80, 100, 140
      ], [
        80, 50, 20, 200, 150, 10 
      ]), //inclination in deg
      new Distribution([
        0.1, 1, 10, 20
      ], [
        0.9967, 0.0031, 0.0002
      ]), //size in cm
      N //number of particles
    );

    ctxs.forEach(function(ctx) {
      Crush.clear(ctx, 'black');  
    });
    render();
  }

  function render() {
    ctxs.forEach(function(ctx) {
      Crush.clear(ctx, 'black');  
    });

    system.particles.forEach(function(particle, idx) {
      if (idx % RENDER_EVERY !== 0) return;

      var psize = SIZE_SCALE*Math.log(1 + particle.size);

      //canvas 0
      var shifted0 = [
        particle.pos[0] + DIMS[0]/2,
        particle.pos[1] + DIMS[1]/2
      ];
      Crush.drawPoint(ctxs[0], shifted0, psize, PART_COL);

      //canvas 1
      var shifted1 = [
        particle.pos[2] + DIMS[0]/2,
        particle.pos[0] + DIMS[1]/2
      ];
      Crush.drawPoint(ctxs[1], shifted1, psize, PART_COL);

      //canvas 2
      var shifted2 = [
        particle.pos[2] + DIMS[0]/2,
        particle.pos[1] + DIMS[1]/2
      ];
      Crush.drawPoint(ctxs[2], shifted2, psize, PART_COL);
    });

    system.update();
    requestAnimationFrame(render);
  }
  

  /***********
   * helpers */
  function getProjOnPlane(pt, n) {
    return sub(pt, smult(dot(pt, n), n));
  }

  function smult(s, a) {
    return a.map(function(comp) {
      return comp*s;
    });
  }

  function sub(a, b) {
    return a.map(function(c, idx) {
      return c - b[idx];
    });
  }

  function norm(a) {
    var mag = Math.sqrt(a.reduce(function(sum, comp) {
      return sum + comp*comp;  
    }));
    return a.map(function(comp) {
      return comp/mag;  
    });
  }

  function dot(a, b) {
    return a.reduce(function(sum, c, idx) {
      return sum + c*b[idx];
    });
  }

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
