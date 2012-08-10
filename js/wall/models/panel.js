/*global wall:true*/
wall.module(function(wall, $, window) {

  function Panel(opts) {
    opts = opts || {};
    this.workspace = opts.workspace;
    this.container = $('<div class="panel"></div>');
//     this.container.on('click', function() {
//       this.workspace.removePanel(this);
//     }.bind(this));
    this.container.on('mousedown', this.onDragStart)
      .on('mouseup', this.onDragEnd);
  }

  wall.Mixins.mix(Panel);

  Panel.prototype.attach = function(el) {
    el.append(this.container);
    this.onAttach.call(this);
  };

  Panel.prototype.setPosition = function(opts) {
    this.container.css({
      left: (opts.x || 0),
      top: (opts.y || 0)
    });
  };

  Panel.prototype.remove = function() {
    this.container.remove();
    this.onRemove.call(this);
  };

  Panel.prototype.reveal = function() {
    window.setTimeout(function() {
      this.container.addClass('open');
    }.bind(this), 15);
  };

  Panel.prototype.hide = function(callback) {
    if (callback) {
      this.container.on('webkitTransitionEnd transitionend', function() {
        this.container.off('webkitTransitionEnd transitionend');
        callback();
      }.bind(this));
    }
    this.container.removeClass('open');
  };

  Panel.prototype.clone = function() {
    var newPanel = new Panel(this);
    this.onClone.call(this);
    return newPanel;
  };

  Panel.prototype.onDrag = function(e) {
    var top = e.clientY - this.workspace.offset().top - this.offsetY,
      left = e.clientX - this.workspace.offset().left - this.offsetX;
    /* Reset position back to 0 if outside box */
    top = top > 10 ? top : 10,
    left = left > 10 ? left : 10;
    this.container.css({
      top: top,
      left: left,
      right: 'auto',
      bottom: 'auto'
    });
  };

  Panel.prototype.onDragEnd = function(e) {
    $(window).off('mouseup', this.onDragEnd).off('mousemove', this.onDrag);
    this.container.removeClass('dragging');
    $(document.body).removeClass('dragging');
  };

  Panel.prototype.onDragStart = function(e) {
    this.offsetX = e.offsetX || (e.pageX - $(e.target).offset().left);
    this.offsetY = e.offsetY || (e.pageY - $(e.target).offset().top);
    $(window).on('mouseup', this.onDragEnd).on('mousemove', this.onDrag);
    this.container.addClass('dragging');
    $(document.body).addClass('dragging');
  };

  Panel.prototype.toJSON = function() {
    return window.JSON.stringify({
    });
  };

  wall.Panel = Panel;

});