/*global genera:true*/
(function(window) {

  var genera = {};

  if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function(context) {
      var that = this;
      return function() {
        return that.apply(context || null,
                          Array.prototype.slice.call(arguments));
      };
    };
  }

  genera.module = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (fn.apply(window,[window.genera, window.jQuery, window].concat(args)));
  };

  genera.events = {
    TRANSITION: 'webkitTransitionEnd transitionend',
    MOUSEMOVE: 'mousemove',
    MOUSEUP: 'mouseup',
    MOUSEDOWN: 'mousedown',
    CLICK: 'click',
    KEYUP: 'keyup',
    KEYDOWN: 'keydown'
  };

  genera.classNames = {
    DRAGGING: 'dragging',
    OPEN: 'open',
    ANIMATE: 'animate',
    POSITIONS: 'far-previous previous current next far-next forward backward'
  };

  window.genera = genera;

}(window));