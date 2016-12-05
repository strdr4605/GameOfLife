'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(obj) {
    _classCallCheck(this, Game);

    document.querySelector(obj['el']).width = innerWidth;
    document.querySelector(obj['el']).height = innerHeight;
    this.ctx = document.querySelector(obj['el']).getContext('2d'), this.cellSize = obj['cellSize'] || 18, this.delay = obj['delay'] || 500, this.cellPadding = obj['cellPadding'] || 0, this.rle = obj['rle'] || '', this.sceneWidth = document.querySelector(obj['el']).clientWidth, this.sceneHeight = document.querySelector(obj['el']).clientHeight, this.minimum = obj['minimum'] || 2, this.maximum = obj['maximum'] || 3, this.spawn = obj['spawn'] || 3, this.cellElement = this.cellSize + this.cellPadding * 2, this.rows = parseInt(this.sceneWidth / this.cellElement), this.cols = parseInt(this.sceneHeight / this.cellElement);
    this.cellsCount = parseInt(this.rows * this.cols * 0.7), this.grid = this.initGrid();
    this.nextGeneration = this.grid;
  }

  _createClass(Game, [{
    key: 'initGrid',
    value: function initGrid() {
      var array = [];
      for (var i = 0; i < this.rows; i++) {
        var a = [];
        for (var j = 0; j < this.cols; j++) {
          a.push(0);
        }array.push(a);
      }
      return array;
    }
  }, {
    key: 'getNeighbours',
    value: function getNeighbours(x, y) {
      var neighbours = this.grid[x][y] === 1 ? -1 : 0;
      for (var h = -1; h <= 1; h++) {
        for (var w = -1; w <= 1; w++) {
          var checkX = x + h;
          var checkY = y + w;
          if (checkY < 0) checkY = this.cols - 1;
          if (checkY == this.cols) checkY = 0;
          if (checkX < 0) checkX = this.rows - 1;
          if (checkX == this.rows) checkX = 0;
          if (this.grid[checkX][checkY] === 1) neighbours++;
        }
      }
      return neighbours;
    }
  }, {
    key: 'seedGrid',
    value: function seedGrid() {
      for (var i = 0; i < this.cellsCount; i++) {
        var x = this.getRandomNumber(0, this.rows);
        var y = this.getRandomNumber(0, this.cols);
        while (this.grid[x][y] == 1) {
          x = this.getRandomNumber(0, this.rows);
          y = this.getRandomNumber(0, this.cols);
        }
        this.grid[x][y] = 1;
      }
    }
  }, {
    key: 'getRandomNumber',
    value: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * max) + min;
    }
  }, {
    key: 'drawCell',
    value: function drawCell(color, x, y) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x * this.cellElement, y * this.cellElement, this.cellSize, this.cellSize);
      // ctx.font = cellSize + 'px Arial';
      // ctx.fillStyle = 'white'
      // ctx.fillText(Game.getNeighbours(x, y), x * cellElement, (y + 1) * cellElement )
    }
  }, {
    key: 'generation',
    value: function generation() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          if (this.grid[i][j] === 1 && this.getNeighbours(i, j) >= this.minimum && this.getNeighbours(i, j) <= this.maximum || this.grid[i][j] === 0 && this.getNeighbours(i, j) === this.spawn) this.nextGeneration[i][j] = 1;
        }
      }this.grid = this.nextGeneration;
      this.nextGeneration = this.initGrid();
      console.log('generation');
    }
  }, {
    key: 'drawGrid',
    value: function drawGrid() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          this.grid[i][j] ? this.drawCell('black', i, j) : this.drawCell('pink', i, j);
        }
      }
    }
  }, {
    key: 'start',
    value: function start() {
      this.seedGrid();
      this.drawGrid();
    }
  }, {
    key: 'nextTick',
    value: function nextTick() {
      this.generation();
      this.drawGrid();
    }
  }]);

  return Game;
}();

var animate = function animate(cb) {
  cb();
  requestAnimationFrame(animate.bind(null, cb));
};

var game = new Game({
  el: '#canvas',
  cellSize: 6,
  delay: 200,
  cellPadding: 0
});

game.start();
animate(function () {
  game.nextTick();
});
