//for unweighted graphs

class BiBreadthFirstSearch
{
    constructor(options)
    {
        options = options || {};
    
        if(!options.allowDiagonal)
        {
            this.diagonalOption = DiagonalOptions.Never;
        }

        else if(options.dontCrossCorners)
        {
            this.diagonalOption = DiagonalOptions.noNeighborBlocked;
        }

        else
        {
            this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
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
                graph.gridOfNodes[i][j].closed = false;
            }
        }
    }

    pathFinder(startX, startY, endX, endY, graph)
    {
        var startOpenList = [],
            endOpenList = [],
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            diagOption = this.diagonalOption,
            neighbors, neighbor, node, foundDest = false;

        start.visits = this.visits.start;
        startOpenList.push(start);

        end.visits = this.visits.end;
        endOpenList.push(end);

        while (startOpenList.length && endOpenList.length)
        {
            node = startOpenList.shift();

            node.closed = true;

            neighbors = graph.getNeighbors(node.x, node.y, diagOption);
            for (var i = 0; i < neighbors.length; ++i)
            {
                neighbor = neighbors[i];
                if(neighbor.closed)
                {
                    continue;
                }

                if (neighbor.isVisited && neighbor.visits == this.visits.end)
                {  
                    foundDest = true; 
                    var p = new Path();
                    p.biTrace(node, neighbor);
                    this.visitsReset(graph);
                    return [];
                }

                if (!neighbor.isVisited)
                {
                    neighbor.isVisited = true;
                    neighbor.visits = this.visits.start;
                    neighbor.parent = node;
                    neighbor.setAsTraversed();
                    startOpenList.push(neighbor);
                }
            }

            node = endOpenList.shift();

            node.closed = true;

            neighbors = graph.getNeighbors(node.x, node.y, diagOption);
            for (var i = 0; i < neighbors.length; ++i)
            {
                neighbor = neighbors[i];

                if(neighbor.closed)
                {
                    continue;
                }

                if (neighbor.isVisited && neighbor.visits == this.visits.start)
                { 
                    foundDest = true;  
                    var p = new Path();
                    p.biTrace(node, neighbor);
                    this.visitsReset(graph);
                    return [];
                }

                if (!neighbor.isVisited)
                {
                    neighbor.isVisited = true;
                    neighbor.visits = this.visits.end;
                    neighbor.parent = node;
                    neighbor.setAsTraversed();
                    endOpenList.push(neighbor);
                }
            }
        }
        !foundDest ? alert("Sorry...No path found 😢") : null;
        return [];
    }
};

