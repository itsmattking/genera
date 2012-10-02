/*global wall:true*/
wall.module(function(wall, $, window) {

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
    console.log('leave');
  };

  Mixins.prototype.onEnter = function() {
    console.log('enter');
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

  wall.Mixins = Mixins;
  wall.Base = Base;

});
