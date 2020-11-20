class AStar
{
    constructor(options)
    {
        options = options || {};
        this.pathCost =  0;
    
        if (!options.allowDiagonal)
        {
            this.diagonalOption = DiagonalOptions.Never;
            this.heuristic = options.heuristic || Heuristic.Manhattan;
        }
    
        else 
        {
            this.heuristic = options.heuristic || Heuristic.Octile;
            if (options.dontCrossCorners)
            {
                this.diagonalOption = DiagonalOptions.noNeighborBlocked;
            }
    
            else
            {
                this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
            }
        }
    }

    

    pathFinder(startX, startY, endX, endY, graph, algo = 'a-star', color = true, prev)
    {
        this.pathCost = 0;

        var start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            diagOption = this.diagonalOption,
            heuristic = this.heuristic,
            closedList = [],
            openList = new MinHeap();

        for(var i = 0; i < graph.rowCount; ++i)
        {
            var temp = [];
            for(var j = 0; j < graph.columnCount; ++j)
            {
                temp.push(false);
            }
            closedList.push(temp);
        }


        //initializing f, g, h for the start node
        openList.insert({f : 0, coord : [startX, startY]});
        start.isVisited = true;
        start.g = start.h = start.f = 0;
        start.parent = prev;

        while(!openList.isEmpty())
        {
            var minElement = openList.popMin(),
                currentX = minElement.coord[0],
                currentY = minElement.coord[1],
                currentNode = graph.getNodeAt(currentX, currentY),
                neighbors = graph.getNeighbors(currentX, currentY, diagOption),
                neighbor, i, gNew, hNew, fNew;

            closedList[currentY][currentX] = true;

            for(i = 0; i < neighbors.length; ++i)
            {
                neighbor = neighbors[i];

                if(neighbor.x == end.x && neighbor.y == end.y)
                {
                    neighbor.parent = currentNode;
                    var p = new Path();
                    p.traceFromEnd(end);
                    var prevNode = graph.getNodeAt(p.path[0][0], p.path[0][1]), diag = 1;
                    for(var i = 1; i < p.path.length; i++)
                    {
                        var box = graph.getNodeAt(p.path[i][0], p.path[i][1]);
                        this.pathCost = this.pathCost + (diag = ((box.x != prevNode.x) && (box.y != prevNode.y)) ? Math.SQRT2 : 1) * (box.weight + prevNode.weight) / 2.0;
                        prevNode = box;
                    }
                    return(p.path);
                }

                var isDiag = false;

                if(neighbor.x !== currentX && neighbor.y !== currentY)
                {
                    isDiag = true;
                }
            
                if(!closedList[neighbor.y][neighbor.x])
                {
                    var val = (neighbor.weight + currentNode.weight) / 2.0;
                    gNew = algo === 'best-first-search' ? 0 : currentNode.g + (isDiag ? Math.SQRT2 * val : val);
                    hNew = algo === 'dijkstra' ? 0 : heuristic(Math.abs(end.x - neighbor.x), Math.abs(end.y - neighbor.y));
                    fNew = gNew + hNew;

                    if(neighbor.isVisited)
                    {    
                        if(neighbor.g > gNew)
                        {
                            openList.decreaseKey(fNew, neighbor.x, neighbor.y);
                            neighbor.f = fNew;
                            neighbor.g = gNew;
                            neighbor.h = hNew;
                            neighbor.parent = currentNode;
                        }
                    }

                    if(!neighbor.isVisited)
                    {
                        openList.insert({f : fNew, coord : [neighbor.x, neighbor.y]});
                        neighbor.isVisited = true;
                        if(color === true) //color the node only when we want to show the search
                        {
                            neighbor.setAsTraversed();
                        }
                        neighbor.f = fNew;
                        neighbor.g = gNew;
                        neighbor.h = hNew;
                        neighbor.parent = currentNode;
                    }
                }
            }
        }
        return [];
    }
};