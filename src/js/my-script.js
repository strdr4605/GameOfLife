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

let Game = {}

Game.cellSize = 5
Game.sceneWidth = document.getElementById('canvas').clientWidth
Game.sceneHeight = document.getElementById('canvas').clientHeight
Game.rows = parseInt(Game.sceneWidth / Game.cellSize)
Game.cols = parseInt(Game.sceneHeight / Game.cellSize)
Game.delay = 500
Game.minimum = 2
Game.maximum = 3
Game.spawn = 3
Game.generation = 0
Game.grid = initGrid(Game.rows, Game.cols, 0)

function draw () {
  var canvas = document.getElementById('canvas')
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d')

  }
}

console.log(Game)
