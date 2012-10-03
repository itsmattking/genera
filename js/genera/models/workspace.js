/*global genera:true*/
genera.module(function(genera, $, window) {

  var events = genera.events,
      classNames = genera.classNames;

  var POSITIONS = classNames.POSITIONS.split(' ').reduce(function(memo, item) {
    memo[item.toUpperCase().replace('-', '_')] = item;
    return memo;
  }, {});

  function Workspace(opts) {
    opts = opts || {};
    this.id = opts.id;
    this.name = opts.name;
    this.fromStore = opts.fromStore;
    this.layout = opts.layout || new genera.Layout({});
    this.panels = [];
    this.container = $('<div class="workspace"></div>');
  }

  genera.Base.inherit(Workspace);

  Workspace.prototype.isVisible = function() {
    return this.container.hasClass(POSITIONS.CURRENT);
  };

  Workspace.prototype.setName = function(name) {
    this.name = name;
  };

  Workspace.prototype.setID = function(id) {
    this.id = id;
    this.container.append('<h4 contenteditable="true" spellcheck="false">' + (this.name || this.id) + '</h4>');
    this.container.attr('data-id', id);
  };

  Workspace.prototype.resetPosition = function() {
    this.container.removeClass(genera.classNames.POSITIONS);
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

  Workspace.prototype.getPanel = function(id) {
    for (var i = 0; i < this.panels.length; i++) {
      if (this.panels[i].id === id) {
        return this.panels[i];
      }
    }
    return null;
  };

  Workspace.prototype.cleanupPanels = function() {
    this.layout.adjust(this.panels);
  };

  Workspace.prototype.panelToTop = function(panel) {
    this.panels.map(function(p) {
      if (p === panel) {
        p.container.css({ zIndex: 99 });
      } else {
        p.container.css({ zIndex: 98 });
      }
    });
  };

  Workspace.prototype.removePanel = function(panel) {
    panel.hide(function() {
      panel.remove();
      this.panels.splice(this.panels.indexOf(panel), 1);
      this.cleanupPanels();
      if (this.fromStore) {
        this.save();
      }
    }.bind(this));
  };

  Workspace.prototype.attach = function(el) {
    el.append(this.container);
    this.onAttach.call(this);
  };

  Workspace.prototype.remove = function(el) {
    this.container.on(events.TRANSITION, function() {
      var p;
      while ((p = this.panels.shift())) {
        p.remove();
      }
      this.container.off();
      this.container.remove();
      this.onRemove.call(this);
      window.localStorage.removeItem('workspace:' + this.id);
    }.bind(this));
    this.container.removeClass(POSITIONS.CURRENT).addClass(POSITIONS.BACKWARD);
  };

  Workspace.prototype.clone = function() {
    var newWorkspace = new Workspace(this);
    this.panels.forEach(function(p) {
      newWorkspace.addPanel(p.clone());
    });
    this.onClone.call(this);
    return newWorkspace;
  };

  Workspace.prototype.onEnter = function() {
    this.panels.forEach(function(p) {
      p.onEnter.call(p);
    });
  };

  Workspace.prototype.onLeave = function() {
    this.panels.forEach(function(p) {
      p.onLeave.call(p);
    });
  };

  Workspace.prototype.save = function() {
    this.fromStore = true;
    window.localStorage.setItem('workspace:' + this.id,
                            window.JSON.stringify(this.toJSON())
                           );
  };

  Workspace.prototype.toJSON = function() {
    var out = {
      id: this.id,
      name: this.name,
      layout: this.layout.toJSON()
    };
    out.panels = this.panels.map(function(p) {
      return p.toJSON();
    });
    return out;
  };

  genera.Workspace = Workspace;

});