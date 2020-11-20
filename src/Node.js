class Node
{
  constructor(x, y, weight)
  {
    this.x = x;

    this.y = y;

    this.weight = weight;

    this.isVisited = false;

    this.parent = null;
  }

  resetToDefault()
  {
    this.weight = 1;
    this.resetVisit();
  }

  resetVisit()
  {
    this.isVisited = false;
    this.parent = null;
  }
};
