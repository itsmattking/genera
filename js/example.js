(function(genera, $, window) {

  var WorkspaceManager = genera.WorkspaceManager,
    Workspace = genera.Workspace,
    Panel = genera.Panel;

  var manager;

  function updatePaging() {
    var workspaceCount = manager.workspaces.length;
    if (workspaceCount === 1) {
      $('.paging').hide();
    } else {
      $('.paging').show();
    }
    var out = [];
    for (var i = 0; i < workspaceCount; i++) {
      out.push('<a href="#" data-workspace="' + i + '">&bull;</a>');
    }
    $('.paging').html(out.join(""));
    $('.paging').css({ marginLeft: ($('.paging').width() / 2)*-1 });
  }

  $('.paging').on('click', 'a', function(e) {
    var s = $(e.target).attr('data-workspace');
    $('.paging a').removeClass('active');
    $(e.target).addClass('active');
    manager.goToWorkspace(s);
    return false;
  });

  $(window).on('keyup', function(e) {
    switch (e.keyCode) {
     case 37:
      manager.previousWorkspace();
      break;
     case 38:
      manager.previousWorkspace();
      break;
     case 39:
      manager.nextWorkspace();
      break;
     case 40:
      manager.nextWorkspace();
      break;
    default:
      break;
    }
    $('.paging a').removeClass('active');
    $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
  });

  function toggleAddMenu() {
    $('#nav #manage-menu').removeClass('open');
    $('#nav #manage-control').removeClass('open');

    $('#nav #add-menu').toggleClass('open');
    $('#nav #add-control').toggleClass('open');
  }

  function toggleManageMenu() {
    $('#nav #add-menu').removeClass('open');
    $('#nav #add-control').removeClass('open');

    $('#nav #manage-menu').toggleClass('open');
    $('#nav #manage-control').toggleClass('open');
  }

  function handleAddMenu(e) {
    var action = $(e.target).attr('data-action');
    switch (action) {
     case 'new-panel':
      manager.getCurrentWorkspace().addPanel(new Panel({}));
      break;
     case 'new-workspace':
      var s = new Workspace({ name: 'New Workspace' });
      manager.addWorkspace(s);
      manager.goToWorkspace(s);
      updatePaging();
      setTimeout(function() {
        $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
      }, 15);
      setTimeout(promptNameEdit, 500);
      break;
    default:
      break;
    }
    toggleAddMenu();
    return false;
  }

  function handleManageMenu(e) {
    var action = $(e.target).attr('data-action');
    switch (action) {
     case 'save-workspace':
      manager.saveCurrentWorkspace();
      break;
     case 'arrange-workspace':
      manager.cleanupCurrentWorkspace();
      break;
     case 'remove-workspace':
      manager.removeWorkspace(manager.getCurrentWorkspace());
      break;
     case 'duplicate-workspace':
      manager.cloneCurrentWorkspace();
      updatePaging();
      setTimeout(promptNameEdit, 500);
      setTimeout(function() {
        $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
      }, 15);
      break;
    default:
      break;
    }
    toggleManageMenu();
    updatePaging();
    window.setTimeout(function() {
      $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
    }, 15);
    return false;
  }

  function promptNameEdit() {
    $('.workspace.current h4').focus();
    var selection = window.document.getSelection();
    var range = window.document.createRange();
    range.selectNodeContents($('.workspace.current h4')[0]);
    selection.addRange(range);
  }

  $('#add-control').on('click', toggleAddMenu);
  $('#manage-control').on('click', toggleManageMenu);
  $('#add-menu').on('click', 'li', handleAddMenu);
  $('#manage-menu').on('click', 'li', handleManageMenu);

  $('#container').on('keydown keyup', '.workspace h4', function(e) {
    switch (e.keyCode) {
     case 9:
      $(e.target).blur();
      manager.getCurrentWorkspace().setName($(e.target).text());
      manager.getCurrentWorkspace().save();
      e.preventDefault();
      break;
     case 13:
      e.preventDefault();
      $(e.target).blur();
      manager.getCurrentWorkspace().setName($(e.target).text());
      manager.getCurrentWorkspace().save();
      break;
     case 37:
      e.stopPropagation();
      break;
     case 38:
      e.stopPropagation();
      break;
     case 39:
      e.stopPropagation();
      break;
     case 40:
      e.stopPropagation();
      break;
    default:
      break;
    }
    e.stopPropagation();
  });

  $(window.document.body).on('click', function(e) {
    if (!$(e.target).parents('#nav').length) {
      $('#nav .open').removeClass('open');
    }
  });

  function initialize() {
    manager = new WorkspaceManager({
      container: $('#container')
    });

    $('#container').height($(window).height());

    updatePaging();

    setTimeout(function() {
      $('.paging').addClass('animate');
    }, 15);

    $(window).on('resize', function() {
      $('#container').height($(window).height());
    });
    manager.loadWorkspaces(function(spaces) {
      if (spaces.length) {
        for (var i = 0; i < spaces.length; i++) {
          var s = new Workspace({ name: spaces[i].name, id: spaces[i].id, fromStore: true });
          manager.addWorkspace(s);
          for (var j = 0; j < spaces[i].panels.length; j++) {
            s.addPanel(new Panel({
              id: spaces[i].panels[j].id
            }));
          }
        }
        updatePaging();
        setTimeout(function() {
          $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
        }, 15);
      } else {
        var workspace = new Workspace({ name: 'Home' });
        manager.addWorkspace(workspace);
        manager.goToWorkspace(0);
      }
      manager.goToWorkspace(0);
    });
  }

  $(window).ready(initialize);

}(genera, jQuery, window));