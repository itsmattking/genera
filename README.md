# Create fluid dashboards out of disparate parts

## How it works

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

