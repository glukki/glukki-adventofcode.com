const debug = require('debug')('app')

const REQUIRED = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // 'cid',
]

const run = input => {
  const passports = input.split('\n\n')
    .map(lines => lines.split('\n').join(' '))
    .map(line => line.split(' ').reduce((map, kv) => {
      return map.set(...kv.split(':'))
    }, new Map()))

  return passports.reduce((count, pass) => {
    return count + Number(REQUIRED.every(key => pass.has(key)))
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
