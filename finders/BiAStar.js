class BiAStar
{
    constructor(options)
    {
        options = options || {};

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
        this.visits = {start: 1, end: 2};
    }

    visitsReset(graph)
    {
        for(var i = 0; i < graph.rowCount; i++)
        {
            for(var j = 0; j < graph.columnCount; j++)
            {
                if(graph.gridOfNodes[i][j].visits != undefined)
                {
                    graph.gridOfNodes[i][j].visits = undefined;
                }
            }
        }
    }

    pathFinder(startX, startY, endX, endY, grid, algo = "a-star")
    {
        var startOpenList = new MinHeap(),
            endOpenList = new MinHeap(),
            graph = grid.graph,
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            closedList = [], neighbors, neighbor, foundDest = false;

        for(var i = 0; i < graph.rowCount; ++i)
        {
            var temp = [];
            for(var j = 0; j < graph.columnCount; ++j)
            {
                temp.push(false);
            }
            closedList.push(temp);
        }

        startOpenList.insert({f: 0, coord: [startX, startY]});
        start.isVisited = true;
        start.visits = this.visits.start;
        start.g = start.f = 0;

        endOpenList.insert({f: 0, coord: [endX, endY]});
        end.isVisited = true;
        end.visits = this.visits.end;
        end.g = end.f = 0;

        while(!startOpenList.isEmpty() && !endOpenList.isEmpty())
        {
            var minElement = startOpenList.popMin(),
                currentNode = graph.getNodeAt(minElement.coord[0], minElement.coord[1]);

            closedList[currentNode.y][currentNode.x] = true;
            
            neighbors = graph.getNeighbors(currentNode.x, currentNode.y, this.diagonalOption);

            for(var i = 0; i < neighbors.length; i++)
            {
                neighbor = neighbors[i];
                
                if(neighbor.visits === this.visits.end)
                {
                    foundDest = true;
                    this.visitsReset(graph);
                    var p = new Path();
                    p.biTrace(currentNode, neighbor);
                    return [];
                }

                var isDiag = false;

                if(neighbor.x !== currentNode.x && neighbor.y !== currentNode.y)
                {
                    isDiag = true;
                }

                if(!closedList[neighbor.y][neighbor.x])
                {
                    var val = (neighbor.weight + currentNode.weight) / 2.0,
                        gNew = algo === 'best-first-search' ? 0 : currentNode.g + (isDiag ? Math.SQRT2 * val : val),
                        hNew = algo === 'dijkstra' ? 0 : this.heuristic(Math.abs(end.x - neighbor.x), Math.abs(end.y - neighbor.y)),
                        fNew = gNew + hNew;

                    if(neighbor.isVisited)
                    {    
                        if(neighbor.g > gNew)
                        {
                            startOpenList.decreaseKey(fNew, neighbor.x, neighbor.y);
                            neighbor.f = fNew;
                            neighbor.g = gNew;
                            neighbor.h = hNew;
                            neighbor.parent = currentNode;
                        }
                    }
        
                    if(!neighbor.isVisited)
                    {
                        startOpenList.insert({f : fNew, coord : [neighbor.x, neighbor.y]});
                        neighbor.isVisited = true;
                        neighbor.setAsTraversed();
                        neighbor.f = fNew;
                        neighbor.g = gNew;
                        neighbor.h = hNew;
                        neighbor.parent = currentNode;
                        neighbor.visits = this.visits.start;
                    }
                }
            }

            minElement = endOpenList.popMin(),
            currentNode = graph.getNodeAt(minElement.coord[0], minElement.coord[1]);

            closedList[currentNode.y][currentNode.x] = true;
            
            neighbors = graph.getNeighbors(currentNode.x, currentNode.y, this.diagonalOption);

            for(var i = 0; i < neighbors.length; i++)
            {
                neighbor = neighbors[i];
                
                if(neighbor.visits === this.visits.start)
                {
                    foundDest = true;
                    this.visitsReset(graph);
                    var p = new Path();
                    p.biTrace(currentNode, neighbor);
                    return [];
                }

                var isDiag = false;

                if(neighbor.x !== currentNode.x && neighbor.y !== currentNode.y)
                {
                    isDiag = true;
                }

                if(!closedList[neighbor.y][neighbor.x])
                {
                    var val = (neighbor.weight + currentNode.weight) / 2.0,
                        gNew = algo === 'best-first-search' ? 0 : currentNode.g + (isDiag ? Math.SQRT2 * val : val),
                        hNew = algo === 'dijkstra' ? 0 : this.heuristic(Math.abs(start.x - neighbor.x), Math.abs(start.y - neighbor.y)),
                        fNew = gNew + hNew;

                    if(neighbor.isVisited)
                    {    
                        if(neighbor.g > gNew)
                        {
                            endOpenList.decreaseKey(fNew, neighbor.x, neighbor.y);
                            neighbor.f = fNew;
                            neighbor.g = gNew;
                            neighbor.h = hNew;
                            neighbor.parent = currentNode;
                        }
                    }
        
                    if(!neighbor.isVisited)
                    {
                        endOpenList.insert({f : fNew, coord : [neighbor.x, neighbor.y]});
                        neighbor.isVisited = true;
                        neighbor.setAsTraversed();
                        neighbor.f = fNew;
                        neighbor.g = gNew;
                        neighbor.h = hNew;
                        neighbor.parent = currentNode;
                        neighbor.visits = this.visits.end;
                    }
                }
            }
        }
        !foundDest ? alert("Sorry...No path found 😢") : null;
        return [];
    }
};