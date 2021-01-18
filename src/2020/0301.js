const debug = require('debug')('app')

const STEP_X = 3

const run = input => {
  return input.split('\n')
    .map(line => line.split('').map(char => (char === '#')))
    .reduce(({ count, x }, row) => {
      return {
        count: count + Number(row[x]),
        x: (x + STEP_X) % row.length,
      }
    }, { count: 0, x: 0 })
    .count
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
