const debug = require('debug')('app')

const ANGLES = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 5, y: 1 },
  { x: 7, y: 1 },
  { x: 1, y: 2 },
]

const run = input => {
  const grid = input.split('\n')
    .map(line => line.split('').map(char => Number(char === '#')))

  const countTrees = (grid, { x: stepX, y: stepY }) => {
    let count = 0
    let [y, x] = [0, 0]

    while (y < grid.length) {
      count += grid[y][x]
      y += stepY
      x = (x + stepX) % grid[0].length
    }

    return count
  }

  return ANGLES.map(angle => countTrees(grid, angle))
    .reduce((mul, num) => mul * num, 1)
}

let input = ''
process.stdin.setEncoding('utf8')
process.stdin
  .on('readable', () => {
    let chunk
    while ((chunk = process.stdin.read()) !== null) {
      debug('chunk: %s', chunk)
      input += chunk
    }
  })
  .on('end', () => {
    console.log(run(input))
  })
