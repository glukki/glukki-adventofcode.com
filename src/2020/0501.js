const debug = require('debug')('app')

const run = input => {
  const binaryLineToNumber = (line, positive = 'B') => {
    return line.split('')
      .map(char => Number(char === positive))
      .reduce((num, bin) => ((num << 1) + bin), 0)
  }

  return input.split('\n')
    .map(line => {
      const [row, col] = [
        binaryLineToNumber(line.slice(0, 7), 'B'),
        binaryLineToNumber(line.slice(7, 10), 'R'),
      ]
      return { row, col, id: row * 8 + col }
    })
    .reduce((max, item) => {
      return max.id > item.id ? max : item
    })
    .id
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
