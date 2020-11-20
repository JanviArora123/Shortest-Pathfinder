class IDAStar
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
    }

    pathFinder(startX, startY, endX, endY, graph)
    {
        graph.resetVisited();
    
        var h = function(a, b) {
            return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
        }.bind(this);

        var cost = function(a, b) {
            var diag;
            return (diag = (a.x === b.x || a.y === b.y) ? 1 : Math.SQRT2) * ((a.weight + b.weight) / 2.0);
        };

        this.startTime = new Date().getTime();

        var start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            threshold = this.heuristic(Math.abs(startX - endX), Math.abs(startY - endY)),
            maxDepth = graph.rowCount * graph.columnCount,
            path = [], temp = false;

        var search = function(currentNode, g, threshold, path, depth)
        {
            var timeDiff = new Date().getTime() - this.startTime;
            if (timeDiff > 7000)
            {
                // Enforced as "path-not-found".
                alert("Sorry IDAStar is taking a lot of time 😢");
                return Infinity;
            }
        
            if(currentNode === end)
            {
                /*
                    path starts being populated only after the end node is found
                */
                path[depth] = [currentNode.x, currentNode.y];
                return true;
            }
            
            /*
                g - distance from source of currentNode
                h - distance to end from currentNode
                f = g + h
            */
            var f = g + h(currentNode, end);
            
            /*
                when a node with f > cutoff value found, return to previous level and
                search another neighbor
            */
            if(f > threshold)
            {
                return false;
            }

            var neighbors = graph.getNeighbors(currentNode.x, currentNode.y, this.diagonalOption), i; //temp = null, min = Infinity,
            

            for(i = 0; i < neighbors.length; i++)
            {
                var neighbor = neighbors[i];
                //neighbor.count = neighbor.count + 1 || 1;
                neighbor.setAsTraversed();
                temp = search(neighbor, g + cost(currentNode, neighbor), threshold, path, depth + 1);

                /*
                    Search() returns true only when the goal has been found
                */
                if(temp == true)
                {
                    /*
                        retracing path - once end node is found, keep returning the end node in temp
                        and adding the currentNode in path
                    */
                    path[depth] = [currentNode.x, currentNode.y];
                    return true;
                }

                if(temp == Infinity)
                {
                    return Infinity;
                }
            }
            return(false);

        }.bind(this);

        while(!temp)
        {
            path = [];

            graph.resetVisited();

            temp = search(start, 0, threshold, path, 0);

            if(temp == Infinity)
            {
                return [];
            }

            /*
                when goal cannot be found, threshold value returned would become very big over time
            */
            if(threshold >= maxDepth)
            {
                alert("Sorry...No path found 😢");
                return [];
            }

            /*
                if none of the above conditions are true, temp would be the minimum 'f' that crossed 
                the threshold.
            */
            if(temp == false)
            {
                threshold++;
            }
        }
        return(path);
    }
};