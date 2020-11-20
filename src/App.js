function processGrid(rowCount, columnCount, width, height, boxSize)
{
  project.clear();
  const graph = new Graph(rowCount, columnCount, Box);
  graph.createGrid();
  graph.process();
  states.Context.ActiveGrid = new Grid(width, height, graph, boxSize);
  states.Context.Runner = new Runner(states.Context.ActiveGrid);
  states.Context.Runner.paintGrid();

  states.Context.Runner.onRunnerStop = function() {
    states.runnerDuration.text(
      `${states.Context.Runner.duration} ms`
    );
  };
}

function init()
{
  var boxSize = states.DEFAULT_BOX_SIZE;
  var [rowCount, columnCount] = Utils.getRowColumnCount(boxSize);
  
  states.toolModeInput.change(function(event) {
    states.Context.ActiveGrid.actionMode = states.TOOL_MODE[this.value];
  });

  states.clearGraphBtn.click(function(event) {
    states.Context.Runner.clearGrid();
  });
  states.resetGraphBtn.click(function(event) {
    states.Context.Runner.resetGrid();
  });

  $('.option_label').click(function(event) {
    $(this).prev().click();
  });

  function getSpeed()
  {
    const runner = states.Context.Runner;
    const speed = $('input[name="speed-choice"]:checked').val();//event.target.dataset["speed"];
    runner.speed = states.RunnerSpeeds[speed];
    states.speedNameDisplay.text(speed);
  }

  function getWeight()
  {
    const weight = $('input[name="weight-choice"]:checked').val();
    states.Context.weight= states.WEIGHTS_VALUE[weight];
  }

  states.startStopBtn.click(function(event) {
    if(states.Context.FREE && states.Context.ActiveGrid.startNode != null && states.Context.ActiveGrid.endNode != null)
    {
      states.Context.Runner.resetGrid();
      states.Context.Runner.getAlgo();
      states.algoNameDisplay.text(states.Context.Runner.finderName);
      getSpeed();
      getWeight();
      states.Context.Runner.init();
      states.runnerDuration.text(states.Context.Runner.duration);
      if(!states.Context.Runner.running)
      {
        states.Context.Runner.onRunnerStop();
      }
    }
  });
  
  processGrid(rowCount, columnCount, states.width, states.height, boxSize);
}

paper.install(window);
$(document).ready(function(_) {
  paper.setup("graph-canvas");
  init();
});

$(function() {
  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
});

$(".dropdown-menu a.dropdown-toggle").on("click", function(e) {
  if (
    !$(this)
      .next()
      .hasClass("show")
  ) {
    $(this)
      .parents(".dropdown-menu")
      .first()
      .find(".show")
      .removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass("show");

  $(this)
    .parents("li.nav-item.dropdown.show")
    .on("hidden.bs.dropdown", function(e) {
      $(".dropdown-submenu .show").removeClass("show");
    });

  return false;
});
