var Tetris = function() {
  this.BLOCK = 35; // Size of block
  this.HCOUNT = 10; // Number of block in width
  this.VCOUNT = 18; // Numbser of block in height
  this.WIDTH = this.BLOCK * this.HCOUNT; // Canvas with
  this.HEIGHT = this.BLOCK * this.VCOUNT; // Canvas height
  this.NormalSpeed = 900;
  this.BottomSpeed = 50;
  this.DefaultSpeed = 900;
  this.started = false;
}

/**
 * Tetrominos coordinate
 * @return array of objects
 */
 Tetris.prototype.tetrominos = function() {
   return [
    { // CUBE
    	color: '#F0F000', // yellow
    	0: [[0,0], [1,1], [0,1], [1,0]], 1: [[0,0], [1,1], [0,1], [1,0]],
    	2: [[0,0], [1,1], [0,1], [1,0]], 3: [[0,0], [1,1], [0,1], [1,0]]
    },
    { // L
    	color: '#EFA000', // orange
    	0: [[0,0],[1,0],[1,1],[1,2]], 1: [[0,1],[1,1],[2,1],[2,0]],
    	2: [[0,0],[0,1],[0,2],[1,2]], 3: [[0,0],[1,0],[2,0],[0,1]]
    },
    { // Reverse L
    	color: '#0000F0', // blue
    	0: [[0,0],[1,0],[0,1],[0,2]], 1: [[0,0],[1,0],[2,0],[2,1]],
    	2: [[1,0],[1,1],[1,2],[0,2]], 3: [[0,0],[0,1],[1,1],[2,1]]
    },
    { // S
    	color: '#00EF00', // green
    	0: [[0,1],[1,1],[1,0],[2,0]], 1: [[0,0],[0,1],[1,1],[1,2]],
    	2: [[0,1],[1,1],[1,0],[2,0]], 3: [[0,0],[0,1],[1,1],[1,2]]
    },
    { // Z
    	color: '#EF0000', // red
    	0: [[0,0],[1,0],[1,1],[2,1]], 1: [[1,0],[1,1],[0,1],[0,2]],
    	2: [[0,0],[1,0],[1,1],[2,1]], 3: [[1,0],[1,1],[0,1],[0,2]]
    },
    { // T
    	color: '#A000EF', // purple
    	0: [[0,0],[1,0],[2,0],[1,1]], 1: [[0,-1],[0,0],[0,1],[1,0]],
    	2: [[0,0],[1,-1],[2,0],[1,0]], 3: [[2,-1],[1,0],[2,0],[2,1]]
    },
    { // Line
    	color: '#00F0F0', // light blue
    	0: [[0,0], [0,1], [0,2], [0,3]], 1: [[-1,1],[0,1],[1,1],[2,1]],
    	2: [[0,0], [0,1], [0,2], [0,3]], 3: [[-1,1],[0,1],[1,1],[2,1]]
    }
    ];
  };