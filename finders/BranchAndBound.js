class BranchAndBound
{
    constructor()
    {
        this.N = 0;
    }

    visitStation(parentMatrix, route, level, i, j)
    {
        var branch = new Branch();
        branch.route = route;
        if(level)
        {
            branch.route.push([i, j]);
        }
        branch.reducedMatrix = parentMatrix;

        for(var k = 0; level != 0 && k < parentMatrix.length; k++)
        {
            branch.reducedMatrix[i][k] = branch.reducedMatrix[k][j] = Infinity;
        }

        branch.reducedMatrix[j][0] = Infinity;
        branch.level = level;
        branch.station = j;

        return branch;
    }

    rowReduction(branch)
    {
        var row = [];
        for(var i = 0; i < this.N; i++)
        {
            row.push(Infinity);
            for(var j = 0; j < this.N; j++)
            {
                if(branch.reducedMatrix[i][j] < row[i])
                {
                    row[i] = branch.reducedMatrix[i][j];
                }
            }
        }

        for(var i = 0; i < this.N; i++)
        {
            for(var j = 0; j < this.N; j++)
            {
                if(branch.reducedMatrix[i][j] != Infinity && row[i] != Infinity)
                {
                    branch.reducedMatrix[i][j] -= row[i];
                }
            }
        }
        return row; 
    }

    columnReduction(branch)
    {
        var col = [];
        for(var i = 0; i < this.N; i++)
        {
            col[i] = Infinity;
        }

        for(var i = 0; i < this.N; i++)
        {
            for(var j = 0; j < this.N; j++)
            {
                if(branch.reducedMatrix[i][j] < col[j])
                {
                    col[j] = branch.reducedMatrix[i][j];
                }
            }
        }

        for(var i = 0; i < this.N; i++)
        {
            for(var j = 0; j < this.N; j++)
            {
                if(branch.reducedMatrix[i][j] != Infinity && col[j] != Infinity)
                {
                    branch.reducedMatrix[i][j] -= col[j];
                }
            }
        }
        return col;
    }

    getCost(branch)
    {
        var cost = 0,
            row = this.rowReduction(branch),
            col = this.columnReduction(branch);

        for(var i = 0; i < this.N; i++)
        {
            cost += row[i] != Infinity ? row[i] : 0;
            cost += col[i] != Infinity ? col[i] : 0;
        }
        return cost;
    }

    travelingSalesman(adjacencyMatrix)
    {
        this.N = adjacencyMatrix.length;
        var queue = new MyPriorityQueue(),
            route = [],
            src = this.visitStation(adjacencyMatrix, route, 0, -1, 0);
        
        src.cost = this.getCost(src);
        queue.insert(src);

        while(!queue.isEmpty())
        {
            var min = queue.popMin(),
                station = min.station;

            if(min.level == this.N - 1)
            {
                min.route.push([station, 0]);
                return min.route;
            }

            for(var j = 0; j < this.N; j++)
            {
                if(min.reducedMatrix[station][j] != Infinity)
                {
                    var child = this.visitStation(min.reducedMatrix, min.route, min.level + 1, station, j);

                    child.cost = min.cost + min.reducedMatrix[station][j] + this.getCost(child);

                    queue.insert(child);
                }
            }
        }
        return [];
    }
};