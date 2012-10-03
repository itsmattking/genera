(function(genera, $, window) {

  var WorkspaceManager = genera.WorkspaceManager,
    Workspace = genera.Workspace,
    Panel = genera.Panel;

  var manager = new WorkspaceManager({
    container: $('#wall')
  });

  function addVis() {
    var s = new Workspace();
    for (var i = 0, len = Math.ceil(Math.random()*9); i < len; i++) {
      s.addPanel(new Panel({}));
    }
    manager.addWorkspace(s);
  }

  for (var i = 0; i < 12; i++) {
    addVis();
  }
  manager.goToWorkspace(0);

  function updatePaging() {
    var workspaceCount = $('.workspace').length;
    var out = [];
    $('.workspace').each(function(i, item) {
      out.push('<a href="#" data-workspace="' + i + '">&bull;</a>');
    });
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

  $('form').on('submit', function(e) {
    manager.goToWorkspace(parseInt($('#num').val()));
    e.preventDefault();
    return false;
  });

  $(window).on('resize', function() {
    $('#wall').height($(window).height());
  });

  function handleHUDEscapement(e) {
    if (!$(e.target).hasClass('hud') &&
        !$(e.target).parents('.hud').length) {
      var curHUD = $('.hud.active');
      $(window.document.body).off('click', handleHUDEscapement);
      hideHUD('#' + curHUD.attr('id'));
    }
  }

  function hideHUD(id) {
    $('.overlay').on('webkitTransitionEnd', function() {
      $(this).remove();
    });
    $(id).removeClass('active');
    $('.overlay').removeClass('active');
  }

  function showHUD(id) {
    $(window.document.body).append('<div class="overlay"></div>');
    $(window.document.body).on('click', handleHUDEscapement);
    setTimeout(function() {
      $(id).addClass('active');
      $('.overlay').addClass('active');
    }, 15);
  }

  function toggleHUD(id) {
    $('.overlay').length ? hideHUD(id) : showHUD(id);
    return false;
  }

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
      toggleHUD('#new-panel-hud');
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

  $('#wall').on('keydown keyup', '.workspace h4', function(e) {
    switch (e.keyCode) {
     case 9:
      $(e.target).blur();
      manager.getCurrentWorkspace().setName($(e.target).text());
      e.preventDefault();
      break;
     case 13:
      e.preventDefault();
      $(e.target).blur();
      manager.getCurrentWorkspace().setName($(e.target).text());
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

  $('#new-panel-hud img').on('click', function() {
    manager.getCurrentWorkspace().addPanel(new Panel({}));
    toggleHUD('#new-panel-hud');
    return false;
  });

  $('#wall').height($(window).height());
  $('.paging a').removeClass('active');
  $('.paging a[data-workspace="' + manager.getCurrentWorkspaceNum() + '"]').addClass('active');
  updatePaging();
  window.manager = manager;
  setTimeout(function() {
    $('.paging').addClass('animate');
  }, 15);

  var startTouch = {
    x: 0,
    y: 0
  },
  endTouch = {
    x: 0,
    y: 0
  };
  var resetMove;
  $('#wall').on('touchstart', function(e) {
    startTouch.x = e.originalEvent.touches[0].clientX;
    startTouch.y = e.originalEvent.touches[0].clientY;
  });
  $('#wall').on('touchend', function(e) {
    clearTimeout(resetMove);
    var diff = startTouch.x - endTouch.x;
    if (Math.abs(diff) > 200) {
      if (diff < 0) {
        manager.previousWorkspace();
      } else {
        manager.nextWorkspace();
      }
    }
    startTouch.x = 0, startTouch.y = 0;
    endTouch.x = 0, endTouch.y = 0;
  });
  $('#wall').on('touchmove', function(e) {
    if (e.originalEvent) {
      window.console.log(e.originalEvent.touches[0].webkitForce);
      endTouch.x = e.originalEvent.touches[0].clientX;
      endTouch.y = e.originalEvent.touches[0].clientY;
      e.preventDefault();
    }
    clearTimeout(resetMove);
    resetMove = setTimeout(function() {
      startTouch.x = 0;
      endTouch.y = 0;
    }, 200);
  });

}(genera, jQuery, window));