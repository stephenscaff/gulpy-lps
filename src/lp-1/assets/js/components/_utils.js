/**
 * Global Utilities
 */

var util = (function() {

  return {


    /**
     * ForEach Utility
     * Ensure we can loop over a object or nodelist
     * @see https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
     */
    forEach: function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); 
      }
    },

    /** 
     * Throttle Util
     * Provides some sanity to onscroll events, allowing them to 
     * x number of times, instead of nonstop.
     * @param {Function}  Function call to throttle.
     * @param {int}       milliseconds to throttle  method
     * @return {Function} wrapper function that calls fn
     */
    throttle: function(fn, ms) { 
      var time, last = 0;
      
      return function() {
        var a = arguments, t = this, now = +(new Date), exe = function() { last = now; fn.apply(t, a); };
        clearTimeout(time);
        (now >= last + ms) ? exe() : time = setTimeout(exe, ms);
      }
    },

    /**
     * Returns the index of a given element in relation to its siblings, 
     * optionally restricting siblings to those matching a provided selector
     * @param   {Element}   el
     * @param   {string}    [selector]
     * @return  {number}
     */

    index: function(el, selector) {
      var i = 0;

      while ((el = el.previousElementSibling) !== null) {
        if (!selector || el.matches(selector)) {
          ++i;
        }
      }

      return i;
    },

    /**
     * Toggle State
     * A reuseable method to change a data-state attribute
     * (instead of adding/removing classes for state based interactions)
     * @param   {Element}   el
     * @param   {string}    [selector]
     * @param   {string}    [selector]
     */
    toggleState: function (elem, one, two) {
      var elem = document.querySelector(elem);
      elem.setAttribute('data-state', elem.getAttribute('data-state') === one ? two : one);
    },


    /** 
     * Enables transitioning from display none to block
     * @param   {Element}   el
     */
    transitionState: function(elem){

      var elem = document.querySelector(elem);
      var stateEl = elem.getAttribute('data-state');

      if (stateEl  === 'open') {
        elem.setAttribute('data-state', 'closing');
        setTimeout(function(){
          elem.setAttribute('data-state', 'closed');
        }, 800);
      }
      if (stateEl  === 'closed') {
        elem.setAttribute('data-state', 'opening');
        setTimeout(function(){
          elem.setAttribute('data-state', 'open');
        }, 10);
      }
    },
  };
 })();
