const debug = require('debug')('app')

const run = str => {
  return str.split('\n')
    .map(line => {
      const [rule, seed] = line.split(': ')
      const [minMax, needle] = rule.split(' ')
      const [min, max] = minMax.split('-').map(Number)
      return { seed: '' + seed, needle: '' + needle, min, max }
    })
    .reduce((sum, { seed, needle, min, max }) => {
      const count = seed.split('').filter(s => s === needle).length
      return sum + Number(count >= min && count <= max)
    }, 0)
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
