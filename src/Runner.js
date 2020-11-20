class Runner
{
    constructor(activeGrid)
    {
        this.finder = null;
        this.finderName = null;
        this.grid = activeGrid;
        this.path = [];
        this.lines = new Path();
        this.timer = null;
        this.fixedTimer = null;
        this.count = 0;
        this.__speed = 0; // maximum
        this.onStop = null;
        this.onStart = null;
        this.onFrame = null;
        this.__startTime = null;
        this.__endTime = null;
        this.onRunnerStop = () => {};
        this.Heuristic = {
            //when we can move only in 4 directions (N, S, E, W)

            Manhattan: function(dx, dy)
            {
              return dx + dy;
            },

            Chebyshev: function(dx, dy)
            {
              return Math.max(dx, dy);
            },

            //when we can move in any of the 8 directions

            Euclidean: function(dx, dy)
            {
              return Math.sqrt(dx * dx + dy * dy);
            },

            Octile: function(dx, dy)
            {
              var root2 = Math.SQRT2;
              return Math.max(dx, dy) + (root2 - 1) * Math.min(dx, dy);
            }
        };
    }

    resetStartEnd()
    {
        this.grid.__start_node = this.grid.getBox(this.grid.startNode.y, this.grid.startNode.x);
        this.grid.setStart();
        this.grid.__end_node = this.grid.getBox(this.grid.endNode.y, this.grid.endNode.x);
        this.grid.setEnd();
    }

    setDefaultStartEnd()
    {
        this.grid.__start_node = this.grid.getBox(states.DEFAULT_POS.START_Y, states.DEFAULT_POS.START_X);
        this.grid.setStart();
        this.grid.__end_node = this.grid.getBox(states.DEFAULT_POS.END_Y, states.DEFAULT_POS.END_X);
        this.grid.setEnd();
    }

    getAlgo()
    {
        var algo;

        if(this.grid.arrayOfInter.length && 
            ($('a[aria-expanded="true"]').data("algo") != 'multiStop' && 
            $('a[aria-expanded="true"]').data("algo") != 'travelSales'))
        {
            $('a[aria-expanded="true"]').addClass("collapsed");
            $('a[aria-expanded="true"]').attr("aria-expanded","false");
            $('.show').removeClass("show");
            $('#travelsales_algo').removeClass("collapsed");
            $('#travel_sales_list').addClass("show");
            $('#travelsales_algo').attr("aria-expanded","true");
            algo = 'travelSales';
        }

        else
        {
            algo = $('a[aria-expanded="true"]').data("algo");
        }

        var allowDiagonal, dontCrossCorners, heuristic, biDirectional, maxCost = 100;
        switch (algo)
        {
            case 'aStar':
                allowDiagonal = typeof $('#a_star_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#a_star_list ' +
                                         '.bi_directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#a_star_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name="a_star_heuristic"]:checked').val();
                if (biDirectional)
                {
                    this.finder = new states.Runners['biAStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "Bi-Directional A-Star";
                }

                else
                {
                    this.finder = new states.Runners['aStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "A-Star";
                }
                break;

            case 'idAStar':
                allowDiagonal = typeof $('#ida_star_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#ida_star_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name="idastar_heuristic"]:checked').val();

                this.finder = new states.Runners['idAStar']({
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDA-Star";

                break;

            case 'bfs':
                allowDiagonal = typeof $('#bfs_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#bfs_list ' +
                                         '.bi_directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#bfs_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                if (biDirectional)
                {
                    this.finder = new states.Runners['biBFS']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Breadth First Search";
                }

                else
                {
                    this.finder = new states.Runners['bfs']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Breadth First Search";
                }
                break;

            case 'idDepthFirst':
                allowDiagonal = typeof $('#iddfs_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#iddfs_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name=jump_point_heuristic]:checked').val();

                this.finder = new states.Runners['idDepthFirst']({
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDDepth First Search";

                break;

            case 'bestFirst':
                allowDiagonal = typeof $('#best_first_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#best_first_list ' +
                                         '.bi_directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#best_first_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name="best_first_heuristic"]:checked').val();

                if (biDirectional)
                {
                    this.finder = new states.Runners['biBestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Bi-Directional Best First Search";
                }

                else
                {
                    this.finder = new states.Runners['bestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Best First Search";
                }
                break;

            case 'dijkstra':
                allowDiagonal = typeof $('#dijkstra_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#dijkstra_list ' +
                                         '.bi_directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#dijkstra_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';

                if (biDirectional)
                {
                    this.finder = new states.Runners['biDijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Dijkstra";
                }

                else
                {
                    this.finder = new states.Runners['dijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Dijkstra";
                }
                break;

            case 'travelSales':
                allowDiagonal = typeof $('#travel_sales_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#travel_sales_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name="travel_sales_heuristic"]:checked').val();

                this.finder = new states.Runners['travelSales']({
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "Traveling Salesman";

                break;

            case 'multiStop':
                allowDiagonal = typeof $('#multi_stop_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#multi_stop_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                heuristic = $('input[name="multi_stop_heuristic"]:checked').val();

                maxCost = $('input[name=max_cost]').val() || 100;
                maxCost = maxCost >= 0 ? maxCost : 100;

                this.finder = new states.Runners['multiStop']({
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                    maxCost: maxCost
                });

                this.finderName = "Multiple Stops";

                break;
        }

        console.log("allowDiagonal - " + allowDiagonal + "; dontCrossCorners - " + dontCrossCorners + "; heuristic - " + heuristic + "; biDirectional - " + biDirectional);
    }

    mapPath(i, prevPoint)
    {
        var box = this.grid.getBox(this.path[i][1], this.path[i][0]);
        box.setAsPath();
        this.lines.drawLine(prevPoint[0], prevPoint[1], box.x, box.y);
        prevPoint = [box.x, box.y];
        if(i < this.count - 1)
        {
            setTimeout(() => this.mapPath(i + 1, prevPoint), this.__speed);
        }
    }

    runAlgo()
    {
        this.resetGrid();
        this.lines.eraseLines();
        this.path = [];
        console.log("Running... "+this.finderName);
        var start = this.grid.startNode,
            end = this.grid.endNode,
            path = [];

        this.__startTime = new Date().getTime();
        
        if(this.finder instanceof AStar)
        {
            var algoName = this.finderName === "Best First Search" ? 'best-first-search' :
                           (this.finderName === "Dijkstra" ? 'dijkstra' : 'a-star');
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph, algoName, true);
        }

        else if(this.finder instanceof BiAStar)
        {
            var algoName = this.finderName === "Bi-Directional Best First Search" ? 'best-first-search' :
                           (this.finderName === "Bi-Directional Dijkstra" ? 'dijkstra' : 'a-star');
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid, algoName);
        }

        else if(this.finder instanceof IDDepthFirstSearch)
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid);
        }

        else if(this.finder instanceof MultipleStops || this.finder instanceof TravelingSalesman)
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid, this.lines);
        }

        else
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph);
        }

        if((this.finderName == "A-Star" || this.finderName == "Dijkstra" || this.finderName == "Best First Search") && !path.length)  //  HERE
        {
            alert("Sorry...No path found 😢");
        }

        if(path.length && this.finderName != "Multiple Stops" && this.finderName != "Traveling Salesman" && this.finderName != "Bi-Directional A-Star")
        {
            this.path = path;
            this.count = this.path.length;
            var prevPoint = [path[0][0],path[0][1]];
            if(path.length - 2 > 0)
            {
                this.mapPath(1, prevPoint);
            }

            this.lines.drawLine(path[path.length - 2][0], path[path.length - 2][1],
                                 path[path.length - 1][0], path[path.length - 1][1]);
        }

        states.Context.FREE = true;
        this.stop();
    }

    init()
    {
        this.grid.fixGrid();
        this.onStop = this.onRunnerStop();
        states.Context.FREE = false;
        this.runAlgo();
        if (states.Context.FREE)
        {
            if (!this.count)
            {
                this.onStop ? this.onStop() : null;
            }
            return;
        }
    }


    perform(r, c)
    {
        var box = this.grid.getBox(r, c);

        this.resetGrid();

        if (states.Context.FREE)
        {
            switch (this.grid.__action_mode)
            {
                case states.TOOL_MODE.START_NODE:
                    if(box.nodeType == states.BOX_TYPES.STATION_NODE)
                    {
                        this.grid.removeStation(box.x, box.y);
                    }
                    if (box != this.grid.endNode)
                    {
                        this.grid.__start_node = box;
                        this.grid.setStart();
                    }

                    break;

                case states.TOOL_MODE.TARGET_NODE:
                    if(box.nodeType == states.BOX_TYPES.STATION_NODE)
                    {
                        this.grid.removeStation(box.x, box.y);
                    }
                    if (box != this.grid.startNode)
                    {
                        this.grid.__end_node = box;
                        this.grid.setEnd();
                    }
                    break;
                case states.TOOL_MODE.WEIGHT_NODES:
                  if (box == this.grid.__start_node ||
                      box == this.grid.__end_node ||
                      box.nodeType == states.BOX_TYPES.STATION_NODE)
                      {
                        return;
                      }

                  if (box.nodeType == states.BOX_TYPES.WEIGHT_NODE)
                  {
                    this.grid.setClear(r,c);
                  }
                  else
                  {
                    this.grid.setWeight(r,c);
                  }
                  break;

                case states.TOOL_MODE.WALL_NODES:
                    if (box == this.grid.__start_node ||
                        box == this.grid.__end_node ||
                        box.nodeType == states.BOX_TYPES.WEIGHT_NODE ||
                        box.nodeType == states.BOX_TYPES.STATION_NODE)
                    {
                        return;
                    }

                    if (box.nodeType == states.BOX_TYPES.BLOCK)
                    {
                        this.grid.setClear(r, c);
                    }

                    else
                    {
                        this.grid.setBlock(r, c);
                    }

                    break;

                case states.TOOL_MODE.STATION_NODES:
                    if (box == this.grid.__start_node ||
                        box == this.grid.__end_node)
                    {
                        return;
                    }

                    if (box.nodeType == states.BOX_TYPES.STATION_NODE)
                    {
                        this.grid.removeStation(box.x, box.y);
                        this.grid.setClear(r, c);
                    }

                    else
                    {
                        this.grid.setStation(box.x, box.y);
                        this.grid.__dragEnabled = false;
                    }

                    break;
            }
        }
    }

    addEvents(box, r, c)
    {
        var grid = this.grid,
            self = this;
        box.path.onMouseEnter = function(e) {
            if (grid.__dragEnabled)
            {
                self.perform(r, c);
            }
        };

        box.path.onMouseDown = function(event) {
            event.preventDefault();
            grid.__dragEnabled = true;
            self.perform(r, c);
        };
        box.path.onMouseUp = function(event) {
            grid.__dragEnabled = false;
        };
    }

    paintGrid()
    {
        var sideLength = this.grid.boxSize || this.grid.getBoxSideLength();
        for (var r = 0; r < this.grid.graph.rowCount; r++)
        {
            for (var c = 0; c < this.grid.graph.columnCount; c++)
            {
                var node = this.grid.graph.gridOfNodes[r][c];
                var x1 = sideLength * c;
                var y1 = sideLength * r;
                var x2 = x1 + sideLength;
                var y2 = y1 + sideLength;

                node.setPoints(new Point(x1, y1), new Point(x2, y2));
                node.draw();
                this.addEvents(node, r, c);
            }
        }

        this.finder = new AStar({
            allowDiagonal: true,
            dontCrossCorners: false,
            heuristic: this.Heuristic.Octile()
        });

        this.finderName = "A-Star";

        console.log("SET THE DEFAULT FINDER TO - "+this.finderName);

        this.setDefaultStartEnd();
        states.Context.weight=states.DEFAULT_WEIGHT;
    }

    resetGrid()
    {
        if(states.Context.FREE)
        {
            this.grid.graph.resetVisited(); //important line (memory exception without it)
            this.grid.resetTraversal();
            const sn = this.grid.startNode;
            const en = this.grid.endNode;
            sn ? sn.resetText() : null;
            en ? en.resetText() : null;
            this.resetStartEnd();
            this.lines.eraseLines();
        }
    }

    clearGrid()
    {
        if(states.Context.FREE)
        {
            this.grid.graph.resetDefault();
            for (var r = 0; r < this.grid.graph.rowCount; r++)
            {
                for (var c = 0; c < this.grid.graph.columnCount; c++)
                {
                    var box = this.grid.getBox(r, c);

                    box.resetText(); //  HERE

                    if(box.nodeType !== states.BOX_TYPES.START_NODE ||
                        box.nodeType !== states.BOX_TYPES.END_NODE)
                    {
                        if(box.nodeType == states.BOX_TYPES.STATION_NODE)
                        {
                            this.grid.removeStation(c, r);
                        }
                        this.grid.setClear(r, c);
                    }

                    this.lines.eraseLines();
                }
            }
            this.setDefaultStartEnd();
        }
    }

    stop()
    {
        clearTimeout(this.timer);
        this.timer = null;
        this.__endTime = new Date().getTime();
        this.onStop ? this.onStop() : null;
    }

    set speed(speed)
    {
        this.__speed = speed;
    }

    get running()
    {
        return this.timer != null || this.fixedTimer != null ? true : false;
    }

    get speed()
    {
        return this.__speed;
    }

    get duration()
    {
        return states.Context.FREE ? this.__endTime - this.__startTime : 0;
    }
};
