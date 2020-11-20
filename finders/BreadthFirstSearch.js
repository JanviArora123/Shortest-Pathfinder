//for unweighted graphs

class BreadthFirstSearch
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

    pathFinder(startX, startY, endX, endY, graph)
    {
        var openList = [],
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            diagOption = this.diagonalOption,
            neighbors = [];

        start.isVisited = true;
        openList.push(start);

        while (openList.length)
        {
            var node = openList.shift();

            if (end.x == node.x && end.y == node.y)
            {   
                end.setAsEnd();
                var p = new Path();
                p.traceFromEnd(end);
                return(p.path);
            }

            else
            {
                node.isVisited = true;
            }

            neighbors = graph.getNeighbors(node.x, node.y, diagOption);
            for (var i = 0; i < neighbors.length; ++i)
            {
                if (!neighbors[i].isVisited)
                {
                    neighbors[i].isVisited = true;
                    neighbors[i].parent = node;
                    neighbors[i].setAsTraversed();
                    openList.push(neighbors[i]);
                }
            }
        }
        alert("Sorry...No path found :(");
        return [];
    }
};

