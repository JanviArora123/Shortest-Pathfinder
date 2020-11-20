class Graph
{
  constructor(rowCount, columnCount, nodeCls)
  {
    this.rowCount = rowCount;

    this.columnCount = columnCount;

    this.nodeCls = nodeCls;
    
    this.gridOfNodes = [];

    this.isProcessed = false;
  }

  createGrid(matrix = undefined)
  {  
    var gridOfNodes = [];

    var i, j;

    for (i = 0; i < this.rowCount; i++)
    {
      var temp = [];
      for (j = 0; j < this.columnCount; j++)
      {
        temp.push(new this.nodeCls(j, i, 1));
      }
      gridOfNodes.push(temp);
    }

    if (matrix === undefined)
    {
      this.gridOfNodes = gridOfNodes;
    }

    else if (matrix.length != this.rowCount || matrix[0].length != this.columnCount)
    {
      throw new Error("Matrix size does not fit");
    }

    else
    {
      for (i = 0; i < this.rowCount; i++)
      {
        for (j = 0; j < this.columnCount; j++)
        {
          if (matrix[i][j] != 1)
          {
            gridOfNodes[i][j].weight = matrix[i][j];
          }
        }
      }
    }
    
    this.gridOfNodes = gridOfNodes;
  }

  isOnGrid(x, y)
  {
    return x >= 0 && x < this.columnCount && (y >= 0 && y < this.rowCount);
  }

  isWalkable(x, y)
  {
    return this.gridOfNodes[y][x].weight === Infinity ? false : true;
  }

  walkCost(x, y)
  {
    if (isOnGrid(x, y))
    {
      return this.gridOfNodes[y][x].weight;
    }
    
    else
    {
      throw new Error("Coordinates not found");
    }
  }

  changeNodeState(x, y, newWeight)
  {
    this.gridOfNodes[y][x].weight = newWeight;
  }

  clear(x, y)
  {
    this.gridOfNodes[y][x].weight = 1;
  }

  block(x, y)
  {
    this.gridOfNodes[y][x].weight = Infinity;
  }

  visitNode(x, y)
  {
    this.gridOfNodes[y][x].isVisited = true;
  }

  resetVisited()
  {
    var i, j;

    for (i = 0; i < this.rowCount; i++)
    {
      for (j = 0; j < this.columnCount; j++)
      {
        this.gridOfNodes[i][j].resetVisit();       
      }
    }
  }

  resetDefault()
  {
    var i, j;

    for (i = 0; i < this.rowCount; i++)
    {
      for (j = 0; j < this.columnCount; j++)
      {
        this.gridOfNodes[i][j].resetToDefault();
      }
    }
  }

  getNodeAt(x, y)
  {
    return this.gridOfNodes[y][x];
  }

  getNeighbors(x, y, diagOption)
  {
    var neighbours = [];
    var N = false,
      NW = false,
      W = false,
      SW = false,
      S = false,
      SE = false,
      E = false,
      NE = false;

    // ↑ N
    if (this.isOnGrid(x, y - 1) && this.isWalkable(x, y - 1))
    {
      neighbours.push(this.gridOfNodes[y - 1][x]);
      N = true;
    }

    // → W
    if (this.isOnGrid(x + 1, y) && this.isWalkable(x + 1, y))
    {
      neighbours.push(this.gridOfNodes[y][x + 1]);
      W = true;
    }

    // ↓ S
    if (this.isOnGrid(x, y + 1) && this.isWalkable(x, y + 1))
    {
      neighbours.push(this.gridOfNodes[y + 1][x]);
      S = true;
    }

    // ← E
    if (this.isOnGrid(x - 1, y) && this.isWalkable(x - 1, y))
    {
      neighbours.push(this.gridOfNodes[y][x - 1]);
      E = true;
    }

    if (diagOption === DiagonalOptions.Never)
    {
      return neighbours;
    }

    // deciding which unblocked diagonals can be picked
    else if (diagOption === DiagonalOptions.noNeighborBlocked)
    {
      NW = N && W ? true : false;
      SW = S && W ? true : false;
      NE = N && E ? true : false;
      SE = S && E ? true : false;
    }
    
    else if (diagOption === DiagonalOptions.oneNeighborBlocked)
    {
      NW = this.isOnGrid(x + 1, y - 1) && (N || W) ? true : false;
      SW = this.isOnGrid(x + 1, y + 1) && (S || W) ? true : false;
      NE = this.isOnGrid(x - 1, y - 1) && (N || E) ? true : false;
      SE = this.isOnGrid(x - 1, y + 1) && (S || E) ? true : false;
    }
    
    else
    {
      NW = this.isOnGrid(x + 1, y - 1) ? true : false;
      SW = this.isOnGrid(x + 1, y + 1) ? true : false;
      NE = this.isOnGrid(x - 1, y - 1) ? true : false;
      SE = this.isOnGrid(x - 1, y + 1) ? true : false;
    }

    // ↗
    if (NW && this.isWalkable(x + 1, y - 1))
    {
      neighbours.push(this.gridOfNodes[y - 1][x + 1]);
    }

    // ↘
    if (SW && this.isWalkable(x + 1, y + 1))
    {
      neighbours.push(this.gridOfNodes[y + 1][x + 1]);
    }

    // ↖
    if (NE && this.isWalkable(x - 1, y - 1))
    {
      neighbours.push(this.gridOfNodes[y - 1][x - 1]);
    }

    // ↙
    if (SE && this.isWalkable(x - 1, y + 1))
    {
      neighbours.push(this.gridOfNodes[y + 1][x - 1]);
    }

    return neighbours;
  }

  process()
  {
    this.isProcessed = true;
  }

  get nodeCount()
  {
    return this.rowCount * this.columnCount;
  }
};