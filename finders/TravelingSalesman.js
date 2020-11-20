class TravelingSalesman
{
    constructor(options)
    {
        options = options || {};

        this.allowDiagonal = options.allowDiagonal;
        this.dontCrossCorners = options.dontCrossCorners;
        this.heuristic = !options.allowDiagonal ? 
                         (options.heuristic || Heuristic.Manhattan) : 
                         (options.heuristic || Heuristic.Octile);
        this.searchAlgo = new AStar({'allowDiagonal' : this.allowDiagonal,
                                      'dontCrossCorners' : this.dontCrossCorners,
                                      'heuristic' : this.heuristic});
    }

    pathFinder(startX, startY, endX, endY, grid, lines)
    {
        var graph = grid.graph,
            arrayOfInter = grid.arrayOfInter,
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            i, j;

        /*
            algo has been split into different sections for ease of understanding
        */
    
        var route = [];
        /*
            arrayOfInter is an array of intermediate coordinates [x,y]
        */

        route.push(start);
        start.id = 0;

        for(i = 0; i < arrayOfInter.length; i++)
        {
            var interNode = graph.getNodeAt(arrayOfInter[i].x, arrayOfInter[i].y);
            route.push(interNode);
            route[i + 1].id = i + 1;
        }

        route.push(end);
        route[i + 1].id = i + 1;

        var l = route.length,
            adjacencyMatrix = [];
      
        for(i = 0; i < l; i++)
        {
            var temp = [];
            for(j = 0; j < l; j++)
            {
                temp.push(Infinity);
            }
            adjacencyMatrix.push(temp);
        }

        for(i = 0; i < l; i++)
        {
            for(j = i + 1; j < l; j++)
            {
                grid.fixGrid();
                var path = this.searchAlgo.pathFinder(route[i].x, route[i].y, route[j].x, route[j].y, 
                                                        graph, 'a-star', true);

                if(path.length)
                {
                    adjacencyMatrix[i][j] = adjacencyMatrix[j][i] = this.searchAlgo.pathCost;
                }
            }
        }

        /*
            Using Branch And Bound method to find the route
        */

        var branchAndBound = new BranchAndBound(),
            routeNew = branchAndBound.travelingSalesman(adjacencyMatrix),
            path = [];

        if(!routeNew.length)
        {
            alert("Sorry... No way to cover all nodes 😢");
            return [];
        }

        for(i = 0; i < routeNew.length; i++)
        {
            grid.graph.resetVisited();
            
            var node = grid.graph.getNodeAt(route[routeNew[i][0]].x, route[routeNew[i][0]].y);  //HERE
            node.changeText(i);  // HERE

            path = this.searchAlgo.pathFinder(route[routeNew[i][0]].x, route[routeNew[i][0]].y, route[routeNew[i][1]].x, route[routeNew[i][1]].y,
                                                    graph, 'a-star', false);
            if(path.length - 2 > 0)
            {
                var prevPoint = [path[0][0], path[0][1]];
                for(j = 1; j < path.length - 1; j++)
                {
                    var box = graph.getNodeAt(path[j][0], path[j][1]);
                    box.setAsPath();
                    lines.drawLine(prevPoint[0], prevPoint[1], box.x, box.y);
                    prevPoint = [box.x, box.y];
                }
                lines.drawLine(prevPoint[0], prevPoint[1], path[path.length - 1][0], path[path.length - 1][1]);
            }
        }
        return [];
    }
};

