/*global wall:true*/
window.wall = {};

if (typeof window.console === 'undefined') {
  window.console = { log: function () {} };
}

if (typeof Function.prototype.bind === 'undefined') {
  Function.prototype.bind = function(context) {
    var that = this;
    return function() {
      return that.apply(context || null,
                        Array.prototype.slice.call(arguments));
    };
  };
}

wall.module = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);
  return (fn.apply(window,[window.wall, window.jQuery, window].concat(args)));
};

wall.events = {
  TRANSITION: 'webkitTransitionEnd transitionend',
  MOUSEMOVE: 'mousemove',
  MOUSEUP: 'mouseup',
  MOUSEDOWN: 'mousedown',
  CLICK: 'click',
  KEYUP: 'keyup',
  KEYDOWN: 'keydown'
};

wall.classNames = {
  DRAGGING: 'dragging',
  OPEN: 'open',
  ANIMATE: 'animate',
  POSITIONS: 'far-previous previous current next far-next forward backward'
};