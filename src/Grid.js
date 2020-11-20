class Box extends Node
{
  constructor(x, y, weight)
  {
    super(x, y, weight);
    this.pointTL = null;
    this.pointBR = null;
    this.nodeType = states.BOX_TYPES.CLEAR;
    this.__path = null;
    this.__centerText = null;
  }

  changeText(text)
  {
    this.__centerText.content = `${text}`;
  }

  resetText()
  {
    this.__centerText.content = "";
  }

  setAsStart()
  {
    this.nodeType = states.BOX_TYPES.START_NODE;
    this.__path.fillColor = {
      gradient: {
        stops: states.COLORS.BOX_TYPE_START_NODE_COLORS
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.bottomRight
    };
    this.weight = 1;   //  HERE
  }

  removeAsStart()
  {
    if (this.nodeType == states.BOX_TYPES.START_NODE)
    {
      this.setAsClear();
    }
  }

  setAsEnd()
  {
    this.nodeType = states.BOX_TYPES.END_NODE;
    this.__path.fillColor = {
      gradient: {
        stops: states.COLORS.BOX_TYPE_END_NODE_COLORS
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.rightCenter
    };
    this.weight = 1;
  }

  removeAsEnd()
  {
    if (this.nodeType == states.BOX_TYPES.END_NODE) {
      this.setAsClear();
    }
  }

  setAsClear()
  {
    this.nodeType = states.BOX_TYPES.CLEAR;
    this.__path.fillColor = states.COLORS.BOX_TYPE_CLEAR_COLOR;
    this.resetText();
    this.weight = 1;
  }

  setAsBlock()
  {
    this.nodeType = states.BOX_TYPES.BLOCK;
    this.path.tween(
      {
        fillColor: states.COLORS.BOX_TYPE_BLOCK_COLORS[0]
      },
      {
        fillColor: states.COLORS.BOX_TYPE_BLOCK_COLORS[1]
      },
      300
    );

    this.weight = Infinity;
  }

  setAsWeight()
  {
    this.nodeType = states.BOX_TYPES.WEIGHT_NODE;
    this.path.tween(
      {
        fillColor: states.COLORS.BOX_TYPE_WEIGHT_COLORS[0]
      },
      {
        fillColor: states.COLORS.BOX_TYPE_WEIGHT_COLORS[1]
      },
      300
    );

    this.weight = states.Context.weight;  //  HERE
  }

  setAsStation()
  {
    this.nodeType = states.BOX_TYPES.STATION_NODE;
    this.path.tween(
      {
        fillColor: states.COLORS.BOX_TYPE_STATION_COLORS[0]
      },
      {
        fillColor: states.COLORS.BOX_TYPE_STATION_COLORS[1]
      },
      300
    );
    this.weight = 1;
  }

  setAsTraversed()
  {
    if (this.nodeType == states.BOX_TYPES.BLOCK)
    {
      this.nodeType = states.BOX_TYPES.ERROR_NODE;
      this.__path.fillColor = states.COLORS.BOX_TYPE_ERROR_NODE_COLOR;
    }

    else if(this.nodeType == states.BOX_TYPES.CLEAR)
    {
      this.path.tween(
        {
          fillColor: states.COLORS.BOX_TYPE_TRAVERSED_NODE_COLORS[0]
        },
        {
          fillColor: states.COLORS.BOX_TYPE_TRAVERSED_NODE_COLORS[1]
        },
        200
      );
    }
    this.isVisited = true;
  }

  setAsPath()
  {
    if (this.nodeType == states.BOX_TYPES.CLEAR || this.nodeType == states.BOX_TYPES.WEIGHT_NODE)
    {
      this.path.tween(
        {
          fillColor: states.COLORS.BOX_TYPE_PATH_NODE_COLORS[0]
        },
        {
          fillColor: states.COLORS.BOX_TYPE_PATH_NODE_COLORS[1]
        },
        200
      );
    }
  }

  resetTraversed()
  {
    if (this.nodeType === states.BOX_TYPES.CLEAR)
    {
      this.setAsClear();
    }

    this.resetText();  //  HERE

    if(this.visits != undefined)
    {
      this.visits = undefined;
    }
  }

  setPoints(pointTL, pointBR)
  {
    this.pointTL = pointTL;
    this.pointBR = pointBR;
  }

  draw()
  {
    this.__path = new paper.Path.Rectangle({
      from: this.pointTL,
      to: this.pointBR,
      strokeColor: states.COLORS.BOX_BORDER_COLOR,
      strokeWidth: 0.9,
      fillColor: states.COLORS.BOX_TYPE_CLEAR_COLOR
    });
    this.__centerText = new paper.PointText({
      point: this.__path.bounds.center,
      fillColor: "white",
      justification: "center",
      fontSize: 18  //  HERE
    });
    this.__path.addChild(this.__centerText);
  }

  get path()
  {
    return this.__path;
  }
};



class Grid
{
  constructor(width, height, graph, boxSize)
  {
    this.width = width;
    this.height = height;
    this.graph = graph;
    this.boxSize = boxSize;
    this.__dragEnabled = false;
    this.__start_node = null;
    this.__end_node = null;
    this.__action_mode = states.TOOL_MODE.START_NODE;
    this.__wallA = null;
    this.__wallB = null;
    this.arrayOfInter = [];
  }

  getBoxSideLength()
  {
    var area = this.width * this.height;
    var singleBoxArea = area / this.graph.nodeCount;
    var singleBoxSideLength = Math.sqrt(singleBoxArea);
    return singleBoxSideLength;
  }

  setBlock(r, c)
  {
      this.graph.gridOfNodes[r][c].setAsBlock();
  }

  setClear(r, c)
  {
      this.graph.gridOfNodes[r][c].setAsClear();
  }

  setStart()
  {
    for (var r = 0; r < this.graph.rowCount; r++)
    {
      for (var c = 0; c < this.graph.columnCount; c++)
      {
        this.graph.gridOfNodes[r][c].removeAsStart();
      }
    }
    this.startNode.setAsStart();
  }

  setWeight(r,c)
  {
    this.graph.gridOfNodes[r][c].setAsWeight();
  }

  setEnd()
  {
    for (var r = 0; r < this.graph.rowCount; r++)
    {
      for (var c = 0; c < this.graph.columnCount; c++)
      {
        this.graph.gridOfNodes[r][c].removeAsEnd();
      }
    }
    this.__end_node.setAsEnd();
  }

  setStation(x, y)
  {
    if(this.arrayOfInter.length == states.MAX_STATIONS)
    {
      alert("You can only set these many stations :(");
      return;
    }
    var box = this.getBox(y, x);
    this.arrayOfInter.push({x: x, y: y});
    box.setAsStation();
  }

  removeStation(x, y)
  {
    var l = this.arrayOfInter.length, i;
    for(var i = 0; i < l; ++i)
    {
      if(this.arrayOfInter[i].x == x && this.arrayOfInter[i].y == y)
      {
        var temp = this.arrayOfInter[i];
        this.arrayOfInter[i] = this.arrayOfInter[l - 1];
        this.arrayOfInter[l - 1] = temp;
        console.log(this.arrayOfInter.pop());
        break;
      }
    }
  }

  /*
    Ensures that everything is as it should be before starting the search
  */

  fixGrid()
  {
    for (var r = 0; r < this.graph.rowCount; r++)
    {
      for (var c = 0; c < this.graph.columnCount; c++)
      {
        var box = this.getBox(r,c),
            x = box.nodeType;
        box.isVisited = false;

        box.resetText(); //  HERE

        if(x !== states.BOX_TYPES.START_NODE && x !== states.BOX_TYPES.END_NODE)
          {
            if (x == states.BOX_TYPES.BLOCK || x == states.BOX_TYPES.ERROR_NODE)
            {
              this.setBlock(r, c);
            }

            else if(x == states.BOX_TYPES.WEIGHT_NODE)
            {
              this.setWeight(r,c);
            }

            else if(x == states.BOX_TYPES.STATION_NODE)
            {
              box.setAsStation();
            }

            else
            {
              this.setClear(r, c);
            }
          }
      }
    }
  }

  resetTraversal()
  {
    for (var r = 0; r < this.graph.rowCount; r++)
    {
      for (var c = 0; c < this.graph.columnCount; c++)
      {
        this.graph.gridOfNodes[r][c].resetTraversed();
      }
    }
    this.__wallA = null;
    this.__wallB = null;
  }

  getBox(r, c)
  {
    return this.graph.gridOfNodes[r][c];
  }

  set actionMode(mode)
  {
    this.__action_mode = mode;
  }

  get actionMode()
  {
    return this.__action_mode;
  }

  get boxes()
  {
    return this.graph.gridOfNodes;
  }

  get boxArea()
  {
    return this.graph.gridOfNodes[0][0].path.area;
  }

  get startNode()
  {
    return this.__start_node;
  }

  get endNode()
  {
    return this.__end_node;
  }
};
