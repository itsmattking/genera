/*global wall:true*/
wall.module(function(wall, $, window) {

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

  Mixins.prototype.toJSON = function() {
    return this;
  };

  Mixins.mix = function(other) {
    ['Attach', 'Detach', 'Add', 'Remove', 'Clone'].forEach(function(p) {
      other.prototype['on' + p] = this.prototype['on' + p];
    }.bind(this));
    other.prototype.toJSON = this.prototype.toJSON;
  };

  wall.Mixins = Mixins;

});
