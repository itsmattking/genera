## Create fluid dashboards out of disparate parts

Genera is an extensible dashboard framework.

## Concepts

### The Panel

Panels are generic DOM elements you define. They can contain anything you like.

### The Workspace

Workspace contains and handles sets of panels.

### The Workspace Manager

Workspace Manager contains multiple workspaces.

With these three building blocks you can build one dashboard to rule them all.

## Example Setup

    var WorkspaceManager = genera.WorkspaceManager,
        Workspace = genera.Workspace,
        Panel = genera.Panel;

    var manager = new WorkspaceManager({
      container: $('#container')
    });

    var workspace = new Workspace({
      title: 'Home'
    });

    manager.addWorkspace(workspace);
    manager.goToWorkspace(workspace);

    workspace.addPanel(new Panel({}));

## Extending Panels

Panels are only a skeleton to contain what you define. Here's an example.

    var Panel = genera.Panel;

    function ExtendedPanel(opts) {
      if (opts) {
        Panel.call(this, opts);
        this.container.append('<h3>' + opts.title + '</h3>');
      }
    }

    ExtendedPanel.prototype = new Panel();

You can define handlers for several events on a Panel:

* `onAttach`: Called when a Panel is attached to a Workspace
* `onRemove`: Called when a Panel is removed from a Workspace
* `onEnter`: Called when the parent Workspace enters into view
* `onLeave`: Called when the parent Workspace leaves view
* `onClone`: Called when the Panel is cloned
* `onDragStart`: Called when a Panel has begun a drag action
* `onDrag`: Called when a Panel is dragged
* `onDragEnd`: Called when a Panel has stopped a drag action

There are also some other methods you'll want to override:

* `toJSON`: Return the serialized version of your Panel to be saved into store