 Tetris.prototype.initGame = function()
 {
  /**
   * TOTO
   */
   this.CurrentShape = null; // Current shape in the map
   this.NextShape = null; // Next shape in the map
   this.rotation = 2; // Default rotation
   this.shapePos = []; // Array of shapes positions
   this.VerticalShapePos = this.rotation = 0; // Start horizontal position
   this.HorizontalShapePos = 4; // Start vertical position (middle)
   this.NewObject = true; // New shape ?
   this.StartDate = new Date(); 
   this.fixed = false; // the shape si fixed or not
   this.score = 0; // Default score

   /**
    * All the time updated. Contain different elements of the current game
    * @type {Array}
    */
    this.Map = [];

    for( var i = 0; i < this.HCOUNT; i++ ){
      this.Map[i] = [];
      for( var j = 0; j < this.VCOUNT; j++ )
        this.Map[i][j] = 1;
    }

    this.start();
  }


  /**
   * The game is finish
   */
   Tetris.prototype.gameOver = function()
   {
    this.ctx.fillStyle = "brack";
    this.ctx.font = "bold "+ (this.BLOCK+15) +"px monospace";
    this.ctx.fillText("GAME OVER", this.BLOCK+5, this.BLOCK*9);
    // Stop the game
    clearInterval( this.startMap );
    clearInterval( this.startProc );
    return false;
  };


/**
 * Draw lines for the grid
 */
 Tetris.prototype.drawline = function (movex, fromy, tox, toy)
 {
  this.ctx.beginPath();
  this.ctx.moveTo( movex, fromy );
  this.ctx.lineTo( tox, toy );
  this.ctx.stroke();
};


/**
 * Draw the grid
 * Vertical and Horizontal
 */
 Tetris.prototype.displayGrid = function()
 {
  this.ctx.strokeStyle = 'black';
  this.ctx.lineWidth = 0.4;
  for( i = 1; i < this.WIDTH; i++ ) {
    this.drawline( i * this.BLOCK, 0, i * this.BLOCK, this.HEIGHT);
  }
  for( i = 1; i < this.HEIGHT; i++ ) {
    this.drawline( 0, i * this.BLOCK, this.WIDTH, i * this.BLOCK);
  }
};


/**
 * Display the next Shape into the second canvas
 */
 Tetris.prototype.displayNextShape = function()
 {
  this.ctxNextShape.fillStyle = this.NextShape.color;

  for (var i = 0; i < 4 ; i++) {
    this.ctxNextShape.fillRect(
      this.NextShape[this.rotation][i][0] * this.BLOCK,
      this.NextShape[this.rotation][i][1] * this.BLOCK,
      this.BLOCK,
      this.BLOCK
      )
  }
};


/**
 * Clear and draw canvas
 */
 Tetris.prototype.refreshMap = function()
 {
  this.ctx.clearRect( 0, 0, this.WIDTH, this.HEIGHT );

  for( var i = 0; i < this.HCOUNT; i++ ) {
    this.ctx.save();
      this.ctx.translate( i * this.BLOCK, 0 ); // Move the canvas horizontally

      for( var j = 0; j < this.VCOUNT; j++ ) {
        this.ctx.save();
        this.ctx.translate( 0, j * this.BLOCK ); // Move the canvas vertically

        if( this.Map[i][j] === 2) {
          this.ctx.fillStyle = this.CurrentShape.color;
          this.ctx.fillRect( 0, 0, this.BLOCK, this.BLOCK );
        } else if( typeof this.Map[i][j] === 'string' ) { // Display fixed block
          this.ctx.fillStyle = this.Map[i][j];
          this.ctx.fillRect( 0, 0, this.BLOCK, this.BLOCK );
        }
        this.ctx.restore();
      }
      this.ctx.restore();
    }

    this.displayGrid();
  };


  /**
   * Annimate the shape
   * Remove fulllines
   * ..
   */
   Tetris.prototype.proc = function()
   {
    var color = 1, removeLines = false, x, y, olength, CurrentDate;

    if( this.fixed ){
      removeLines = true;
      this.fixed  = false;
      this.NewObject  = true;
      var color = this.CurrentShape.color;
      this.VerticalShapePos = 0; // Restore the default vertical position
      this.HorizontalShapePos = 4; // Restore the default hori position
      this.rotation = 0;
      this.CurrentShape = this.NextShape;
    };

    for( var i = 0; i < this.shapePos.length; i++ )
      this.Map[ this.shapePos[i][0] ][ this.shapePos[i][1] ] = color;
    this.shapePos = [];

    removeLines && this.removeLines();

      // Generate random shape
      if( this.NewObject ) {
        if (this.NextShape == null) {
          this.CurrentShape = this.shapes[ Math.floor( Math.random() * 7 ) ];
        }

        this.NextShape = this.shapes[ Math.floor( Math.random() * 7 ) ];

        this.ctxNextShape.clearRect( 0, 0, 4 * this.BLOCK, 4 * this.BLOCK );
        this.displayNextShape();
      }

      olength = this.CurrentShape[this.rotation].length;

    // Push the current shape in the map array
    for( var i = 0; i < olength; i++ ) {
      x = this.HorizontalShapePos + this.CurrentShape[this.rotation][i][0];
      y = this.VerticalShapePos + this.CurrentShape[this.rotation][i][1];
      
      // Position is ok ? Ok Push !
      if( this.Map[x][y] ) {
        this.Map[x][y] = 2;
        this.shapePos.push( [ x, y ] );
      }
    };
    
    CurrentDate = new Date();
    
    if( CurrentDate - this.StartDate > this.NormalSpeed ) { 

      var columns = {}
      for( var i = 0; i < olength; i++ ) {
        x = this.HorizontalShapePos + this.CurrentShape[this.rotation][i][0];
        y = this.VerticalShapePos + this.CurrentShape[this.rotation][i][1];

        if( y > 0 ) {
          !isNaN(columns[x]) || (columns[x] = y);
          columns[x] = Math.max( columns[x], y );
        }
      }
      
      for( i in columns )
        if( columns[i] == this.VCOUNT - 1 || this.Map[i][columns[i] + 1] != 1 ) {
          this.fixed = true;
          if( this.NewObject ) {
            this.gameOver();
            //this.initGame();
          }
          this.NormalSpeed = this.DefaultSpeed;
          return;
        }

        this.StartDate= CurrentDate;
        this.VerticalShapePos += 1;
      }

      this.NewObject = false;
    };


    /**
     * Scans the map for check fulllines and removes them.
     * Call the function for displayed the score to player
     */
     Tetris.prototype.removeLines = function()
     {
      var line, fulllines = 0;

      for( var i = this.VCOUNT - 1; i > 0; i-- ) {
        line = true;
        for( var j = 0; j < this.HCOUNT; j++ )
          if( typeof this.Map[j][i] != 'string' )
            line = false;

          if( line ) {
            for( var k = i; k > 0; k-- )
              for( j = 0; j < this.HCOUNT; j++ )
                this.Map[j][k] = this.Map[j][k-1];
              fulllines += 1;
              i++;
            }
          }
        // Call Score method for displayed player score
        this.Score(fulllines);
      }

    /**
     * Check if the shape can move or not :D
     */
     Tetris.prototype.Move = function(side)
     {
      var maxFunc = side == 1 ? Math.max : Math.min, rows = {}, x, y;

      for( var i = 0, olength = this.CurrentShape[this.rotation].length; i < olength; i++ ) {
        y = this.VerticalShapePos + this.CurrentShape[this.rotation][i][1];
        x = this.HorizontalShapePos + this.CurrentShape[this.rotation][i][0] + side;
        !isNaN(rows[y]) || ( rows[y] = x );
        rows[y] = maxFunc( rows[y], x );
      }
      // If the tetrominos is out of the canvas return...
      for( i in rows ) {
        if( rows[i] < 0 || rows[i] > this.HCOUNT-1 || this.Map[ rows[i] ][ i ] != 1 )
          return false;
      }
      return true;
    };

    /**
     * Check if the rotation of the shape can be possible or not :D
     */
     Tetris.prototype.Rotation = function() 
     {
      var to = this.CurrentShape[ (this.rotation + 1) % 4 ], x, y;
      
      for( var i = 0, olength=to.length; i < olength; i++ ) {
        x = this.HorizontalShapePos + to[i][0];
        y = this.VerticalShapePos + to[i][1];

      // Can rotate ?
      if( !this.Map[x] ) {
        var mod = x < 0 ? 1 : -1;
        this.HorizontalShapePos += mod;
        if( this.Rotation() ) return true;
        else this.HorizontalShapePos -= mod;
      }
      
      if( !this.Map[x][y] || typeof this.Map[x][y] === 'string' )
        return false;
    }
    // Rotation is possible
    return true;
  };

  /**
   * Key ? Action ?
   */
   Tetris.prototype.key_mapping = function(event)
   {
    var e = (event) ? event : window.event; // Comptability with this bitch => IE...
    switch (e.keyCode)
    {
      case 38: // Up key
      if (this.Rotation()) this.rotation = (this.rotation + 1) % 4;
      break;

      case 40: // Down key
      this.NormalSpeed = this.BottomSpeed;
      break;

      case 37: // Left key
      if (this.Move(-1)) this.HorizontalShapePos--;
      break;

      case 39: // Right key
      if (this.Move(1)) this.HorizontalShapePos++;
      break;

      case 32: // Escape key
      this.NormalSpeed = 0;
      break;
    }
  };

  /**
   * Initialize the game
   */
   Tetris.prototype.init = function()
   {
    this.canvas = document.getElementById( 'tetris-canvas' );
    this.ctx = this.canvas.getContext( '2d' );
    this.canvas.height = this.HEIGHT;
    this.canvas.width = this.WIDTH;
    this.shapes = this.tetrominos();

    /* Canvas for display the next shape */
    this.canvasNextShape = document.getElementById( 'next-shape' );
    this.ctxNextShape = this.canvasNextShape.getContext( '2d' );
    this.canvasNextShape.height = 4 * this.BLOCK;
    this.canvasNextShape.width = 4 * this.BLOCK;

    this.displayGrid();
    this.initGame();
  };

  /**
   * Start the game
   */
   Tetris.prototype.start = function()
   {
    var self = this;
    this.startMap  = setInterval(function() {self.refreshMap()}, 1000 / 30);
    this.startProc = setInterval(function() {self.proc()}, 1000 / 30);

    document.onkeydown = function(event) {self.key_mapping(event)};

    // Reinitialize original Speed when escape is up
    document.onkeyup = function(event) {
      if( event.which === 40 )
        self.NormalSpeed = self.DefaultSpeed;
    }

  };

  var tetris = new Tetris();

  window.onload = function() {
    tetris.init();
  }