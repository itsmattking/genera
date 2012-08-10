/*global wall:true*/
wall.module(function(wall, $, window) {

  function Layout(opts) {
    opts = opts || {};
    this.items = [];
  }

  Layout.prototype.adjust = function(list) {
    list.forEach(function(v, i) {
      v.setPosition({
        x: (Math.floor(i % 3) * 480) + 20,
        y: (Math.floor(i / 3) * 280) + 80
      });
    });
  };

  wall.Layout = Layout;

});