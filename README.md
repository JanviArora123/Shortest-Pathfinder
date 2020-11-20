# Pirates On Mars

This is a path finding application that covers **three** path finding and optimization problems. Imagine you and your friends are on a rover on Mars. You could be faced with all kinds of unprecedented problems like water bodies, frozen regions, volcanos, mountains, food shortage, low fuel, and what not! We have modelled this application, keeping in mind such scenarios. The application allows you to _choose the locations of the source and destination_, set **obstacles** on Mars, and define difficult environments as **weighted** nodes for every problem. Before we understand the remaining features and functionalities, let's look at the three aforementioned problems:

1. Find the **_shortest_** path from _source_ to _destination_. You can define the state of the space using various features, choose an algorithm from the panel, set the visualization speed, select weights of all the weighted nodes, and click visualize to see the pathfinder build the path.

2. Traveling Salesman - Define **_intermediate stations_** and find the least cost path that starts from _source_, covers all intermediate points _stations_, reaches _destination_ at some point and returns to the source.

3. Path optimization with a maximum cost constraint - Suppose your rover is on a mission. Every intermediate station is a **_food refilling station_**. But alas, your rover has a limited amount of fuel, and you must reach the _destination_ before you run out. The _Multiple Stops_ algorithm tries to optimize at every point, so that with the available fuel, you can reach your destination, while visiting as many stations as you can, on your way there. The default maximum value of the cost that can be incurred on the journey is set to 100. You can change it by entering the value in the **_Maximum Cost_** input box.

### Algorithm Division:

* Shortest Path Between 2 Nodes:

    1. ID Depth First Search
    2. Best First Search
    3. AStar
    4. IDAStar
    5. Dijkstra

* Traveling Salesman:

    1. Traveling Salesman _(branch and bound)_

* Path Optimization with Multiple Nodes and a Maximum Cost:

    1. Multiple Stops _(f-score optimization like AStar)_ : The algorithm finds all distances between the involved nodes (Start, End and Station Nodes). It uses these distances to populate an adjacency matrix. The optimization method used is similar to A*, wherein for every station node that is being considered, we calculate a g value, heuristic and take their weighted sum as the f-score. We start by assuming that only the start node and end node are present in the current route. To find the best node to be visited on the path from start to end, we store the distances of all station nodes from the start as their respective g values, and the distances to the end nodes as their respective heuristic values. The F-Score is then the weighted sum of 'g' and 'h'. We then select the station node with the minimum F-Score to be included in the route from start to end. The next step is to assume that our route is <b><i>Start -> Station Node 1(previously included) -> End </i></b>. We now look for a station node which can be inserted in between station node 1 and the end node. For this, we calculate the F-Scores of the remaining station nodes as weighted sum of g & h wherein<br>
```
        g = dist(start -> station node1) + dist(station node1 -> current station node) 
        h = dist(current station node -> End Node)
```
The algorithm then finds the station node with the least F-Score to include in the path which would then be <b><i>Start -> Station Node 1 -> Station Node 2 -> End </i></b>. Then, it finds the best position to insert this node in the existing array. For instance, <b><i>Start -> Station Node 1 -> Station Node 2 -> End </i></b> may become <b><i>Start -> Station Node 2 -> Station Node 1 -> End </i></b> if that is shorter. This is repeated until all eligible station nodes are included in the path such that the total cost of traversal is less than the maximum cost given by the user. The nodes will be visited in the order described by the algorithm. One can get an intuition by imagining that the station nodes are included in the increasing order of their distance from the line connecting the Start Node and End Node.

The last two algorithms may be used for the first case too.

### Using The Web Interface:

The navigation panel contains various radio buttons to set different nodes :

* **Start Node** _(source - green)_ - To change the location of the starting point.

* **End Node** _(destination - red)_ - To change the location of the end point.

* **Wall Node** _(obstacles - black)_ - To set obstacles in the space. These are essentially nodes with their weights set to **_Infinity_**

* **Weight Node** _(difficult regions to traverse - yellow)_ - To set regions in the space that are difficult to traverse,   i.e., would cost more. The **_Weight_** dropdown allows you to set the weight values of these nodes.

* **Station Node** _(intermediate points for problems 2 and 3 - blue)_ - To set intermediate points, you must first check the **_Allow Stations_** checkbox. This would enable the _Station Node_ button. These are taken into consideration only in the _Traveling Salesman_ and _Multiple Stops_ algorithms. 
_Note: As long as there are Station Nodes on the grid, you can only run the two algos listed above._

* **Random Grid** - To randomly add _Walls_ in space.

* **Dropdowns** - _Speed_ to select the speed of visualization for problem 1, _Weight_ to set weight value of the Weight nodes.

* **Checkboxes** - _Show Unweighted_ to display the unweighted algorithm, i.e., _Breadth First Search_ in the Algorithm Panel on the right, _Allow Stations_ to enable the Station Node radio button.

* **Maximum Cost** - To input a value for the _Maximum Cost_ used in the _Multiple Stops_ algorithm. Should you choose to set no value, a default of 100 is considered as the maximum cost. 

* **Reset Graph** - To clear the traversals and path of the previous visualization.

* **Clear Graph** - To clear the Grid and set the _Start_ and _End_ nodes to default positions.

* **Tutorial - i** - A basic tutorial to using the web application.

* **Algorithm Panel** - Contains the algorithms listed above. _Allow Diagonal_ will enable diagonal traversal, _Dont Cross Corners_ will prevent the path from crossing the corners of _Wall Nodes_, _Bi-Directional_ allows the algorithm start searching from the start and end simultaneously and _Heuristic_ allows you to choose a heuristic function for algorithms that have the feature.


- Used Paper.js to build the Grid and for visualizations.

### Code Organization:
```
---- index.html     
---- assets     
         ---- DiagonalOptions.js        
         ---- EnableDisableStations.js      
         ---- block_generators.js       
         ---- draggable.js      
         ---- logo.png      
         ---- utilities.js      
---- finders        
         ---- AStar.js      
         ---- BiAStar.js        
         ---- BiBreadthFirstSearch.js       
         ---- BranchAndBound.js     
         ---- BreadthFirstSearch.js     
         ---- IDAStar.js        
         ---- IDDepthFirstSearch.js     
         ---- MultipleStops.js      
         ---- TravelingSalesman.js      
---- src        
         ---- App.js        
         ---- DataStructures.js     
         ---- Graph.js      
         ---- Grid.js       
         ---- Heuristic.js      
         ---- Node.js       
         ---- Path.js       
         ---- Runner.js     
         ---- States.js     
---- style      
         ---- css       
                 ---- main.css      
         ---- scss      
                 ---- main.scss     
```
