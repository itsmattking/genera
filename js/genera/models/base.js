/*global genera:true*/
genera.module(function(genera, $, window) {

  function Base() {}

  Base.inherit = function(other, parent) {
    parent = parent || Base;
    parent.call(other);
    Mixins.mix(other);
    other.prototype = new (parent)();
    other.inherit = parent.inherit;
  };

  function Mixins() {}

  Mixins.prototype.onAttach = function() {
  };

  Mixins.prototype.onDetach = function() {
  };

  Mixins.prototype.onAdd = function() {
  };

  Mixins.prototype.onRemove = function() {
  };

  Mixins.prototype.onClone = function() {
  };

  Mixins.prototype.onLeave = function() {
  };

  Mixins.prototype.onEnter = function() {
  };

  Mixins.prototype.toJSON = function() {
    return this;
  };

  Mixins.mix = function(other) {
    ['Attach', 'Detach', 'Add', 'Remove',
     'Clone', 'Leave', 'Enter'].forEach(function(p) {
       other.prototype['on' + p] = this.prototype['on' + p];
    }.bind(this));
    other.prototype.toJSON = this.prototype.toJSON;
  };

  genera.Mixins = Mixins;
  genera.Base = Base;

});
