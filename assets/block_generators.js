function divide(grid, startX, startY, width, height, horizontal) {
  if (width < 3 || height < 3) return;
  if (horizontal) {
    const center_row = Math.round(height / 2);
    const random_col = Math.round(startX + Math.random() * (width - startX));
    var x = null;
    for (var col = startX; col < width; col++) {
      if (col != random_col) {
        grid.setBlock(center_row, col);
      } else {
        grid.setClear(center_row, col);
        x = col;
      }
    }
    divide(grid, startX, startY, x - 1, random_col - 1, false);
  } else {
    const center_col = Math.round(width / 2);
    const random_row = Math.round(startY + Math.random() * (height - startY));
    for (var row = startX; row < width; row++) {
      if (row != random_row) {
        grid.setBlock(row, center_col);
      } else {
        grid.setClear(row, center_col);
      }
    }
  }
}

function RandomGrid() {
  const grid = states.Context.ActiveGrid;
  states.Context.Runner.clearGrid();
  const cols = grid.graph.columnCount - 1;
  const rows = grid.graph.rowCount - 1;
  var sec = 0;
  for (var i = 0; i < Math.max(rows, cols) * 6; i++) {
    sec += 16;
    setTimeout(() => {
      var random_col = Math.round(Math.random() * cols);
      var random_row = Math.round(Math.random() * rows);
      if(random_row!=5 && random_col!=2 && random_col!=5){
            grid.setBlock(random_row, random_col);
      }
    }, sec);
  }
}
