/******************\
|   Distribution   |
| @author Anthony  |
| @version 0.1     |
| @date 2016/01/28 |
| @edit 2016/01/28 |
\******************/

//the Distribution object lets you sample from arbitrary distributions
var Distribution = (function() {
  /**********
   * config */

  /************
   * privates */

  /***********
   * exports */
  var obj = function(min, max) {
    this.min = min; 
    this.max = max; 
  };
  obj.prototype.sample = function() {
    return this.min + (this.max-this.min)*Math.random();
  };

  return obj;
})();
