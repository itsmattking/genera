/*global wall:true*/
wall.module(function(wall, $, window) {

  var events = wall.events,
      classNames = wall.classNames;

  var POSITIONS = classNames.POSITIONS.split(' ').reduce(function(memo, item) {
    memo[item.toUpperCase().replace('-', '_')] = item;
    return memo;
  }, {});

  function WorkspaceManager(opts) {
    opts = opts || {};
    this.container = opts.container;
    this.container.addClass(classNames.ANIMATE);
    this.workspaces = [];
    this.currentWorkspace = 0;
  }

  WorkspaceManager.prototype.cleanupCurrentWorkspace = function() {
    this.getCurrentWorkspace().cleanupPanels();
  };

  WorkspaceManager.prototype.cloneCurrentWorkspace = function() {
    var s = this.getCurrentWorkspace().clone();
    this.addWorkspace(s);
    this.goToWorkspace(s);
  };

  WorkspaceManager.prototype.saveCurrentWorkspace = function() {
    this.getCurrentWorkspace().save();
  };

  WorkspaceManager.prototype.addWorkspace = function(workspace) {
    workspace.attach(this.container);
    workspace.setID('workspace-' + (this.workspaces.length));
    this.workspaces.push(workspace);
  };

  WorkspaceManager.prototype.removeWorkspace = function(workspace) {
    workspace.remove();
    var index = this.workspaces.indexOf(workspace);
    this.workspaces.splice(index, 1);
    this.currentWorkspace = (index > this.workspaces.length - 1) ? index - 1 : index;
    this.moveToCurrentWorkspace();
  };

  WorkspaceManager.prototype.getCurrentWorkspaceNum = function() {
    return this.currentWorkspace;
  };

  WorkspaceManager.prototype.getCurrentWorkspace = function() {
    return this.workspaces[this.currentWorkspace];
  };

  WorkspaceManager.prototype.moveToCurrentWorkspace = function() {
    this.workspaces.map(function(s) {
      s.resetPosition();
    });
    if (this.workspaces[this.currentWorkspace - 2]) {
      this.workspaces[this.currentWorkspace - 2].setPosition(POSITIONS.FAR_PREVIOUS);
    }
    if (this.workspaces[this.currentWorkspace - 1]) {
      this.workspaces[this.currentWorkspace - 1].setPosition(POSITIONS.PREVIOUS);
    }

    this.workspaces[this.currentWorkspace].setPosition(POSITIONS.CURRENT);

    if (this.workspaces[this.currentWorkspace + 1]) {
      this.workspaces[this.currentWorkspace + 1].setPosition(POSITIONS.NEXT);
    }
    if (this.workspaces[this.currentWorkspace + 2]) {
      this.workspaces[this.currentWorkspace + 2].setPosition(POSITIONS.FAR_NEXT);
    }
  };

  WorkspaceManager.prototype.goToWorkspace = function(workspaceOrNum) {
    if (workspaceOrNum instanceof wall.Workspace && this.workspaces.indexOf(workspaceOrNum) !== -1) {
      this.skipToWorkspace(this.workspaces.indexOf(workspaceOrNum));
    } else if (workspaceOrNum >= 0 && workspaceOrNum < this.workspaces.length) {
      workspaceOrNum = parseInt(workspaceOrNum, 10);
      if (Math.abs(workspaceOrNum - this.currentWorkspace) > 1) {
        this.skipToWorkspace(workspaceOrNum);
      } else {
        this.currentWorkspace = workspaceOrNum;
        this.moveToCurrentWorkspace();
      }
    }
  };

  WorkspaceManager.prototype.skipToWorkspace = function(num) {
    num = parseInt(num, 10);
    this.container.removeClass(classNames.ANIMATE);

    var current, next;

    this.workspaces.forEach(function(s, i) {
      if (s === this.workspaces[this.currentWorkspace]) {
        s.setPosition(POSITIONS.CURRENT);
        current = s;
      } else {
        s.resetPosition();
      }
      if (i === num) {
        s.setPosition(POSITIONS.FORWARD);
        next = s;
      }
    }.bind(this));

    if (current && next) {
      this.container.addClass(classNames.ANIMATE);
      next.container.on(events.TRANSITION, function(e) {
        this.container.removeClass(classNames.ANIMATE);
        this.moveToCurrentWorkspace();
        this.container.addClass(classNames.ANIMATE);
        next.container.off(events.TRANSITION);
      }.bind(this));
      window.setTimeout(function() {
        current.setPosition(POSITIONS.BACKWARD);
        next.setPosition(POSITIONS.CURRENT);
        this.currentWorkspace = num;
      }.bind(this), 15);
    }
  };

  WorkspaceManager.prototype.nextWorkspace = function() {
    if (this.currentWorkspace < this.workspaces.length - 1) {
      this.currentWorkspace += 1;
    }
    this.moveToCurrentWorkspace();
  };

  WorkspaceManager.prototype.previousWorkspace = function() {
    if (this.currentWorkspace > 0) {
      this.currentWorkspace -= 1;
    }
    this.moveToCurrentWorkspace();
  };

  WorkspaceManager.prototype.toJSON = function() {
    return window.JSON.stringify({
    });
  };

  WorkspaceManager.POSITIONS = POSITIONS;

  wall.WorkspaceManager = WorkspaceManager;

});