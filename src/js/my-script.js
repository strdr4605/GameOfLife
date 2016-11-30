let Game = {}
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

Game.cellSize = 18
Game.cellPadding = 1
Game.sceneWidth = document.getElementById('canvas').clientWidth
Game.sceneHeight = document.getElementById('canvas').clientHeight
Game.cellElement = Game.cellSize + Game.cellPadding * 2
Game.rows = parseInt(Game.sceneWidth / Game.cellElement)
Game.cols = parseInt(Game.sceneHeight / Game.cellElement)
Game.delay = 500
Game.minimum = 2
Game.maximum = 3
Game.spawn = 3
Game.generation = 0
Game.grid = initGrid(Game.rows, Game.cols, 0)
Game.nextGeneration = initGrid(Game.rows, Game.cols, 0)
Game.seedGrid = function (cellsCount) {
  for (var i = 0; i < cellsCount; i++) {
    Game.grid[getRandomNumber(0, Game.rows)][getRandomNumber(0, Game.cols)] = 1
  }
}

Game.getNeighbours = function (x, y) {
  let neighbours = (Game.grid[x][y] === 1) ? -1 : 0
  for(h = -1; h <= 1; h++){
    for(w = -1; w <= 1; w++){
      checkX = x + h
      checkY = y + w

      if(checkY < 0) checkY = Game.cols - 1
      if(checkY == Game.cols) checkY = 0
      if(checkX < 0) checkX = Game.rows - 1
      if(checkX == Game.rows) checkX = 0

      if (Game.grid[checkX][checkY] === 1) neighbours++
    }
  }
  return neighbours
}

function initGrid (n, m, initial) {
  let array = []
  for(i = 0; i < n; i++){
    a = []
    for(j = 0; j < m; j++){
      a[j] = initial
    }
    array[i] = a
  }
  return array
}

function getRandomNumber (min, max) {
  return Math.floor(Math.random() * max) + min
}

function drawCell (color, x, y, cellElement, cellSize, cellPadding) {
  ctx.fillStyle = color
  ctx.fillRect(x * cellElement, y * cellElement, cellSize, cellSize)
  ctx.font = cellSize + 'px Arial';
    ctx.fillStyle = 'white'
  ctx.fillText(Game.getNeighbours(x, y), x * cellElement, (y + 1) * cellElement )
}

function nextGeneration () {
  for(i = 0; i < Game.rows; i++){
    for(j = 0; j < Game.cols; j++){
      if(Game.grid[i][j] === 1 && Game.getNeighbours(i, j) > Game.minimum && Game.getNeighbours(i, j) <= Game.maximum) Game.nextGeneration[i][j] = 1
      else if(Game.grid[i][j] === 1 && (Game.getNeighbours(i, j) < Game.minimum || Game.getNeighbours(i, j) > Game.maximum)) Game.nextGeneration[i][j] = 0
      else if(Game.grid[i][j] === 0 && Game.getNeighbours(i,j) === Game.spawn) Game.nextGeneration[i][j] = 1
    }
  }
}

function drawGrid () {
  for (var i = 0; i < Game.rows ; i++) {
    for (var j = 0; j < Game.cols ; j++) {
      if (Game.grid[i][j]) {
        drawCell('black', i, j, Game.cellElement, Game.cellSize, Game.cellPadding)
      } else {
        drawCell('pink', i, j, Game.cellElement, Game.cellSize, Game.cellPadding)
      }
    }
  }
}

function draw () {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, Game.sceneWidth, Game.sceneHeight)

    drawGrid()
}


Game.seedGrid(100)
console.log(Game)
