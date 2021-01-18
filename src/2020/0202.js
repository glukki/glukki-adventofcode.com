const debug = require('debug')('app')

const run = str => {
  return str.split('\n')
    .map(line => {
      const [rule, seed] = line.split(': ')
      const [pos, needle] = rule.split(' ')
      const [a, b] = pos.split('-').map(s => (Number(s) - 1)).map(Number)
      return { seed: '' + seed, needle: '' + needle, indices: [a, b] }
    })
    .reduce((sum, { seed, needle, indices: [a, b] }) => {
      const isValid = (seed[a] === needle && seed[b] !== needle) || (seed[a] !== needle && seed[b] === needle)
      return sum + Number(isValid)
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
