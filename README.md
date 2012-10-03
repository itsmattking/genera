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

