class Path
{
    constructor()
    {
        this.path = [];
        this.lineCount = 0;
    }
    
    traceFromEnd(end)
    {
        var path = [],
            node = end;
    
        path.push([end.x, end.y]);

        while (node.parent)
        {
            node = node.parent;
            path.push([node.x, node.y]);
        }
    
        this.path = path.reverse();
    }

    mapPath(i, prevPoint)
    {
        var box = states.Context.ActiveGrid.getBox(this.path[i][1], this.path[i][0]);
        box.setAsPath();
        states.Context.Runner.lines.drawLine(prevPoint[0], prevPoint[1], box.x, box.y);
        prevPoint = [box.x, box.y];
        if(i < this.path.length - 1)
        {
            setTimeout(() => this.mapPath(i + 1, prevPoint), states.Context.Runner.__speed);
        }
    }

    biTrace(node1, node2)
    {
        var prevPoint, l, path1 = [];
        
        this.traceFromEnd(node1);
        path1 = this.path;
        prevPoint = [path1[0][0], path1[0][1]];
        this.traceFromEnd(node2);
        this.path = this.path.reverse();
        this.path = path1.concat(this.path);
        l = this.path.length;
        l > 2 ? this.mapPath(1, prevPoint) : null;
        states.Context.Runner.lines.drawLine(this.path[l - 2][0], this.path[l - 2][1],
            this.path[l - 1][0], this.path[l - 1][1]);
    }

    drawLine(x1, y1, x2, y2)
    {
        var sideLength = states.Context.ActiveGrid.boxSize || states.Context.ActiveGrid.getBoxSideLength(),
            center1 = new Point(sideLength * x1 + sideLength / 2, sideLength * y1 + sideLength / 2),
            center2 = new Point(sideLength * x2 + sideLength / 2, sideLength * y2 + sideLength / 2),
            theta = 0.4, r = 13, dely = (center2.y - center1.y), delx = (center2.x - center1.x), angle = Math.atan(dely / delx);
        var py = dely < 0 ? ((delx >= 0) ? -1 : 1) : ((delx < 0) ? 1 : -1),
            px = dely < 0 ? ((delx >= 0) ? -1 : 1) : ((delx < 0) ? 1 : -1);
        var x = new paper.Path.Line({
                from: center1,
                to: center2,
                strokeColor: "#8b8b00",
                strokeWidth: 2
            });
        var y = new paper.Path.Line({
                from: center2,
                to: new Point(center2.x + px * r * Math.cos(angle + theta), center2.y + py * r * Math.sin(angle + theta)),
                strokeColor: "#8b8b00",
                strokeWidth: 2
            });
        var z = new paper.Path.Line({
                from: center2,
                to:new Point(center2.x + px * r * Math.cos(angle - theta), center2.y + py * r * Math.sin(angle - theta)),
                strokeColor: "#8b8b00",
                strokeWidth: 2
            });
            
          project.activeLayer.addChild(x);
          project.activeLayer.addChild(y);
          project.activeLayer.addChild(z);
          this.lineCount = this.lineCount + 3;
    }

    eraseLines()
    {
        if(!this.lineCount)
        {
            return;
        }

        var children = project.activeLayer.children,
            l = children.length;

        // Iterate through the items contained within the array:
        for (var i = 1; i <= this.lineCount; i++)
        {
            var child = children[l - i];
            child.remove();
        }
        this.lineCount = 0;
    }
};
