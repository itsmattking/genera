/*global genera:true*/
genera.module(function(genera, $, window) {

  function Base() {}

  Base.inherit = function(other, parent) {
    parent = parent || Base;
    parent.call(other);
    other.prototype = new (parent)();
    Mixins.mix(other);
    other.inherit = parent.inherit;
  };

  function Mixins() {}

  Mixins.prototype.onAttach = function() {};

  Mixins.prototype.onRemove = function() {};

  Mixins.prototype.onClone = function() {};

  Mixins.prototype.onLeave = function() {};

  Mixins.prototype.onEnter = function() {};

  Mixins.prototype.toJSON = function() {
    return this;
  };

  Mixins.mix = function(other) {
    ['Attach', 'Remove',
     'Clone', 'Leave', 'Enter'].forEach(function(p) {
       other.prototype['on' + p] = this.prototype['on' + p];
    }.bind(this));
    other.prototype.toJSON = this.prototype.toJSON;
  };

  genera.Base = Base;

});
