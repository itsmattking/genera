/*global wall:true*/
wall.module(function(wall, $, window) {

  var draggedPanel,
      events = wall.events,
      classNames = wall.classNames;

  function startDrag(e, panel) {
    var target = $(e.target);
    draggedPanel = panel;
    draggedPanel.offsetX = e.offsetX || (e.pageX - target.offset().left);
    draggedPanel.offsetY = e.offsetY || (e.pageY - target.offset().top);
    draggedPanel.container.addClass(classNames.DRAGGING);
    draggedPanel.workspace.panelToTop(draggedPanel);
    $(window).on(events.MOUSEUP, stopDrag).on(events.MOUSEMOVE, handleDrag);
    $(document.body).addClass(classNames.DRAGGING);
    draggedPanel.onDragStart(e);
  }

  function stopDrag(e) {
    $(window).off(events.MOUSEUP, stopDrag).off(events.MOUSEMOVE, handleDrag);
    if (draggedPanel) {
      draggedPanel.container.removeClass(classNames.DRAGGING);
      $(document.body).removeClass(classNames.DRAGGING);
      draggedPanel.onDragEnd(e);
      draggedPanel = null;
    }
  }

  function handleDrag(e) {
    var offset = draggedPanel.workspace.container.offset();
    var top = e.clientY - offset.top - draggedPanel.offsetY;
    var left = e.clientX - offset.left - draggedPanel.offsetX;
    top = top > 60 ? top : 60,
    left = left > 10 ? left : 10;
    draggedPanel.setPosition({ x: left, y: top });
    draggedPanel.onDrag(e);
  }

  function Panel(opts) {
    if (opts) {
      opts = opts || {};
      this.id = opts.id || 'panel-' + new Date().getTime();
      this.workspace = opts.workspace;
      this.container = $('<div class="panel"></div>');
      this.container.attr('id', this.id);
      this.x = opts.x || 0;
      this.y = opts.y || 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.container.on(events.CLICK, '.remove', function(e) {
        this.workspace.removePanel(this);
        return false;
      }.bind(this));
      this.container.on(events.MOUSEDOWN, '.draghandle', function(e) {
        startDrag(e, this);
      }.bind(this)).on(events.MOUSEUP, '.draghandle', stopDrag);
    }
    return this;
  }

  wall.Mixins.mix(Panel);

  Panel.prototype.attach = function(el) {
    el.append(this.container);
    this.onAttach.call(this);
  };

  Panel.prototype.setPosition = function(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.container.css({
      left: this.x,
      top: this.y
    });
  };

  Panel.prototype.remove = function() {
    this.container.off();
    this.container.remove();
    this.onRemove.call(this);
  };

  Panel.prototype.reveal = function() {
    window.setTimeout(function() {
      this.container.addClass(classNames.OPEN);
    }.bind(this), 15);
  };

  Panel.prototype.hide = function(callback) {
    if (callback) {
      this.container.on(events.TRANSITION, function() {
        this.container.off(events.TRANSITION);
        callback();
      }.bind(this));
    }
    this.container.removeClass(classNames.OPEN);
  };

  Panel.prototype.clone = function() {
    var newPanel = new Panel(this);
    this.onClone.call(this);
    return newPanel;
  };

  Panel.prototype.onDrag = function(e) {
  };

  Panel.prototype.onDragEnd = function(e) {
  };

  Panel.prototype.onDragStart = function(e) {
  };

  Panel.prototype.toJSON = function() {
    return {
      id: this.id,
      x: this.x,
      y: this.y
    };
  };

  wall.Panel = Panel;

});