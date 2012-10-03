/*global genera:true*/
genera.module(function(genera, $, window) {

  function Layout(opts) {
    opts = opts || {};
  }

  genera.Base.inherit(Layout);

  Layout.prototype.adjust = function(list) {
    list.forEach(function(v, i) {
      v.setPosition({
        x: (Math.floor(i % 3) * 480) + 20,
        y: (Math.floor(i / 3) * 280) + 80
      });
    });
  };

  genera.Layout = Layout;

});