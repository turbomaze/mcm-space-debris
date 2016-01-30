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
  function sampleUniform(min, max) {
    return min + (max-min)*Math.random();
  }

  /***********
   * exports */
  var obj = function(vals, probs) {
    this.vals = vals; 
    //normalize the probabilities so they sum to 1
    var sum = probs.reduce(function(cum, prob){return cum+prob;});
    this.probs = probs.map(function(prob){return prob/sum;}); 
  };
  obj.prototype.sample = function() {
    var p = Math.random();
    for (var ai = 0; ai < this.probs.length; ai++) {
      if (p < this.probs[ai]) return sampleUniform(this.vals[ai], this.vals[ai+1]); 
      else p -= this.probs[ai];
    }
    return sampleUniform(
      this.vals[this.vals.length-2], this.vals[this.vals.length-1]
    );
  };

  return obj;
})();
