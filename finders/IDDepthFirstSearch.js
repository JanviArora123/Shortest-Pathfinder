class IDDepthFirstSearch
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
    }

    pathFinder(startX, startY, endX, endY, activeGrid)
    {
        var graph = activeGrid.graph,
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            diagOption = this.diagonalOption,
            depth = diagOption === DiagonalOptions.Never ?
                    Heuristic.Manhattan(Math.abs(startX - endX), Math.abs(startY - endY)) :
                    Heuristic.Octile(Math.abs(startX - endX), Math.abs(startY -  endY)),
            maxDepth = graph.rowCount * graph.columnCount,
            foundDest = false;
            var startTime = new Date().getTime();

        var DLS = function(start, graph, depthLimit)
        {
            var timediff = new Date().getTime() - startTime;
            if(timediff > 4000)
            {
              maxDepth=0;
              alert("Sorry IDDFS is taking a lot of time 😢");
              return Infinity;
            }

            if(start === end)
            {
                return true;
            }
            
            else
            {
                start.isVisited = true;
            }

            if(depthLimit <= 0)
            {
                return false;
            }

            var neighbors = graph.getNeighbors(start.x, start.y, diagOption), i;

            for(i = 0; i < neighbors.length; i++)
            {
                var neighbor = neighbors[i],
                    isDiag = false;

                if(neighbor.x !== start.x && neighbor.y !== start.y)
                {
                    isDiag = true;
                }

                var val = (neighbor.weight + start.weight) / 2.0,
                    newDist = start.dist + isDiag ? Math.SQRT2 * val : val;

                if(neighbor.isVisited && newDist < neighbor.dist)
                {
                    neighbor.parent = start;
                    neighbor.dist = newDist;
                    neighbor.isVisited = false;
                }

                if(!neighbor.isVisited)
                {
                    neighbor.setAsTraversed();
                    neighbor.parent = start;
                    neighbor.dist = newDist;

                    var temp = DLS(neighbor, graph, depthLimit - 1);

                    if(temp === true)
                    {
                        return true;
                    }

                    else if(temp==Infinity){
                      return Infinity;
                    }
                }
            }
            return false;
        };

        for (;depth <= maxDepth; depth++)
        {
            activeGrid.graph.resetVisited();
            var temp1 = DLS(start, graph, depth);
            if (temp1 === true)
            {
                foundDest = true;
                break;
            }
            else if(temp1==Infinity){
              foundDest=false;
              break;
            }
        }

        if(foundDest === true)
        {
            var p = new Path();
            p.traceFromEnd(end);
            return(p.path);
        }

        else
        {
            alert("Sorry...No path found 😢");
            return [];
        }
    }
};
