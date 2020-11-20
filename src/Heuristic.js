const Heuristic = {
  //when we can move only in 4 directions (N, S, E, W)

  Manhattan: function(dx, dy) {
    return dx + dy;
  },

  Chebyshev: function(dx, dy) {
    return Math.max(dx, dy);
  },

  //when we can move in any of the 8 directions

  Euclidean: function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  },

  Octile: function(dx, dy) {
    let root2 = Math.SQRT2;
    return Math.max(dx, dy) + (root2 - 1) * Math.min(dx, dy);
  }
};
