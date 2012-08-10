(function(window, $) {

  var POSITION_CLASS_LIST = 'far-previous previous current next far-next';
  var POSITIONS = (function(list) {
    return list.split(' ').reduce(function(memo, item) {
      memo[item.toUpperCase().replace('-', '_')] = item;
      return memo;
    }, {});
  }(POSITION_CLASS_LIST));

  function StageManager(opts) {
    opts = opts || {};
    this.container = opts.container;
    this.stages = [];
    this.currentStage = 0;
  }

  StageManager.prototype.addStage = function(stage) {
    this.container.append(stage.container);
    this.stages.push(stage);
    stage.setID('stage-' + (this.stages.length - 1));
  };

  StageManager.prototype.getCurrentStage = function() {
    return this.stages[this.currentStage];
  };

  StageManager.prototype.moveToCurrentStage = function() {
    this.stages.map(function(s) {
      s.resetPosition();
    });
    if (this.stages[this.currentStage - 2]) {
      this.stages[this.currentStage - 2].setPosition(POSITIONS.FAR_PREVIOUS);
    }
    if (this.stages[this.currentStage - 1]) {
      this.stages[this.currentStage - 1].setPosition(POSITIONS.PREVIOUS);
    }

    this.stages[this.currentStage].setPosition(POSITIONS.CURRENT);

    if (this.stages[this.currentStage + 1]) {
      this.stages[this.currentStage + 1].setPosition(POSITIONS.NEXT);
    }
    if (this.stages[this.currentStage + 2]) {
      this.stages[this.currentStage + 2].setPosition(POSITIONS.FAR_NEXT);
    }
  };

  StageManager.prototype.goToStage = function(stageOrNum) {
    if (stageOrNum instanceof Stage && this.stages.indexOf(stageOrNum) !== -1) {
      this.currentStage = this.stages.indexOf(stageOrNum);
    } else if (stageOrNum >= 0 && stageOrNum < this.stages.length) {
      this.currentStage = stageOrNum;
    }
    this.moveToCurrentStage();
  };

  StageManager.prototype.nextStage = function() {
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage += 1;
    }
    this.moveToCurrentStage();
  };

  StageManager.prototype.previousStage = function() {
    if (this.currentStage > 0) {
      this.currentStage -= 1;
    }
    this.moveToCurrentStage();
  };

  StageManager.POSITIONS = POSITIONS;

  function Stage(opts) {
    opts = opts || {};
    this.visualizations = [];
    this.container = $('<div class="stage"></div>');
  }

  Stage.prototype.setID = function(id) {
    this.id = id;
    this.container.attr('data-id', id);
  };

  Stage.prototype.resetPosition = function() {
    this.container.removeClass(POSITION_CLASS_LIST);
  };

  Stage.prototype.setPosition = function(position) {
    this.resetPosition();
    this.container.addClass(position);
  };

  Stage.prototype.addVisualization = function(visualization) {
    this.visualizations.push(visualization);
    this.container.append(visualization.container);
  };

  function Visualization(opts) {
    opts = opts || {};
    this.stage = opts.stage;
    this.container = $('<div class="visualization"></div>');
  }

  window.StageManager = StageManager;
  window.Stage = Stage;
  window.Visualization = Visualization;

}(window, $));