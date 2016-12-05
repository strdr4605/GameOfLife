let Game = {}
let ctx = document.getElementById('canvas').getContext('2d')

canvas.width = document.body.clientWidth //document.width is obsolete
canvas.height = document.body.clientHeight //document.height is obsolete

function setGameObj() {
  let objQuery = parseParms(window.location.hash.substr(1))
  Game.cellSize = parseInt(objQuery.cellSize) || 18
  Game.cellsCount = parseInt(objQuery.cellsCount) || 500
  Game.delay = parseInt(objQuery.delay) || 500
  Game.cellPadding = parseInt(objQuery.cellPadding) || 0
  Game.rle = objQuery.rle || ''
  Game.sceneWidth = canvas.width
  Game.sceneHeight = canvas.height
  Game.cellElement = Game.cellSize + Game.cellPadding * 2
  Game.rows = parseInt(Game.sceneWidth / Game.cellElement)
  Game.cols = parseInt(Game.sceneHeight / Game.cellElement)
  Game.minimum = 2
  Game.maximum = 3
  Game.spawn = 3
  Game.grid = initGrid(Game.rows, Game.cols, 0)
  Game.nextGeneration = initGrid(Game.rows, Game.cols, 0)
  Game.seedGrid = function (cellsCount) {
    for (var i = 0; i < cellsCount; i++) {
      x = getRandomNumber(0, Game.rows)
      y = getRandomNumber(0, Game.cols)
      while( Game.grid[x][y] == 1) {
        x = getRandomNumber(0, Game.rows)
        y = getRandomNumber(0, Game.cols)
      }
      Game.grid[x][y] = 1    }
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
}

function initGrid (n, m, initial) {
  let array = []
  for(i = 0; i < n; i++){
    a = []
    for(j = 0; j < m; j++) a.push(initial)
    array.push(a)
  }
  return array
}

function getRandomNumber (min, max) {
  return Math.floor(Math.random() * max) + min
}

function drawCell (color, x, y, cellElement, cellSize, cellPadding) {
  ctx.fillStyle = color
  ctx.fillRect(x * cellElement, y * cellElement, cellSize, cellSize)
  // ctx.font = cellSize + 'px Arial';
  // ctx.fillStyle = 'white'
  // ctx.fillText(Game.getNeighbours(x, y), x * cellElement, (y + 1) * cellElement )
}

function nextGeneration () {
  for(i = 0; i < Game.rows; i++)
    for(j = 0; j < Game.cols; j++)
      if( (Game.grid[i][j] === 1 && Game.getNeighbours(i, j) >= Game.minimum && Game.getNeighbours(i, j) <= Game.maximum) || (Game.grid[i][j] === 0 && Game.getNeighbours(i, j) === Game.spawn) ) Game.nextGeneration[i][j] = 1
}

function drawGrid () {
  for (var i = 0; i < Game.rows ; i++)
    for (var j = 0; j < Game.cols ; j++)
      (Game.grid[i][j]) ? drawCell('black', i, j, Game.cellElement, Game.cellSize, Game.cellPadding) : drawCell('pink', i, j, Game.cellElement, Game.cellSize, Game.cellPadding)
}

function generation() {
  nextGeneration()
  Game.grid = Game.nextGeneration
  Game.nextGeneration = initGrid(Game.rows, Game.cols, 0)
  drawGrid()
  console.log('new generation')
}

function parseParms (str) {
    var pieces = str.split('&'), data = {}, i, parts
    for (i = 0; i < pieces.length; i++) {
        parts = pieces[i].split('=')
        if (parts.length < 2) parts.push('')
        data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
    }
    return data
}

function draw () {
    setGameObj()
    if(Game.rle) seedGrid2(stringTo2dArray(Game.rle))
    else Game.seedGrid(Game.cellsCount)
    console.log(Game.rows * Game.cols)
    drawGrid()
    render()
}

function render() {
  generation()
  setTimeout(function () {
    requestAnimationFrame(render)
  }, Game.delay)
}

function seedGrid2 (table) {
  for(i = 0; i < table.length; i++)
    for(j = 0; j < table[i].length; j++)
      Game.grid[j][i] = table[i][j]
}

function stringTo2dArray(string) {
  string = string.slice(0, -1)
  return [].concat(...string.split('$').map(el => generateRow(el)))
}

function generateRow (str) {
  var row = []
  var amount = 0
  str.split('').forEach(el => {
    if (el >= '0' && el <= '9') amount = amount * 10 + + el
    else {
      if (amount === 0) amount = 1
      for (let i = 0; i < amount; i++) row.push(el === 'o' ? 1 : 0)
      amount = 0
    }
  })
  var result = [row]
  var emptyArray = []
  for (let i = 0; i < row.length; i++) emptyArray.push(0)
  while (amount-- > 0) result.push([...emptyArray])
  return result
}
