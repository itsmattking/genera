/*global wall:true*/
wall.module(function(wall, $, window) {

  function Workspace(opts) {
    opts = opts || {};
    this.name = opts.name;
    this.layout = opts.layout || new wall.Layout({});
    this.panels = [];
    this.container = $('<div class="workspace"></div>');
  }

  wall.Mixins.mix(Workspace);

  Workspace.prototype.setID = function(id) {
    this.id = id;
    this.container.append('<h4 contenteditable="true" spellcheck="false">' + (this.name || this.id) + '</h4>');
    this.container.attr('data-id', id);
  };

  Workspace.prototype.resetPosition = function() {
    this.container.removeClass(wall.WorkspaceManager.POSITION_CLASS_LIST);
  };

  Workspace.prototype.setPosition = function(position) {
    this.resetPosition();
    this.container.addClass(position);
  };

  Workspace.prototype.addPanel = function(panel) {
    panel.workspace = this;
    panel.attach(this.container);
    this.panels.push(panel);
    this.cleanupPanels();
    panel.reveal();
  };

  Workspace.prototype.cleanupPanels = function() {
    this.layout.adjust(this.panels);
  };

  Workspace.prototype.removePanel = function(panel) {
    panel.hide(function() {
      panel.remove();
      this.panels.splice(this.panels.indexOf(panel), 1);
      this.cleanupPanels();
    }.bind(this));
  };

  Workspace.prototype.attach = function(el) {
    el.append(this.container);
    this.onAttach.call(this);
  };

  Workspace.prototype.remove = function(el) {
    var p;
    while ((p = this.panels.shift())) {
      p.remove();
    };
    this.container.remove();
    this.onRemove.call(this);
  };

  Workspace.prototype.clone = function() {
    var newWorkspace = new Workspace(this);
    this.panels.forEach(function(p) {
      newWorkspace.addPanel(p.clone());
    });
    this.onClone.call(this);
    return newWorkspace;
  };

  Workspace.prototype.toJSON = function() {
    return window.JSON.stringify({
    });
  };

  wall.Workspace = Workspace;

});