const debug = require('debug')('app')

const RULES = [
  { key: 'byr', rule: /^(?:19[2-9][0-9]|(?:200[0-2]))$/ },
  { key: 'iyr', rule: /^(?:201[0-9]|2020)$/ },
  { key: 'eyr', rule: /^(?:202[0-9]|2030)$/ },
  { key: 'hgt', rule: /^(?:1(?:[5-8][0-9]|9[0-3])cm|(?:59|6[0-9]|7[0-6])in)$/ },
  { key: 'hcl', rule: /^#[0-9a-f]{6}$/ },
  { key: 'ecl', rule: /^(?:amb|blu|brn|gry|grn|hzl|oth)$/ },
  { key: 'pid', rule: /^[0-9]{9}$/ },
]

const run = input => {
  const passports = input.split('\n\n')
    .map(lines => lines.split('\n').join(' '))
    .map(line => line.split(' ').reduce((map, kv) => {
      return map.set(...kv.split(':'))
    }, new Map()))

  return passports.reduce((count, pass) => {
    return count + Number(RULES.every(({ key, rule }) => pass.has(key) && rule.test(pass.get(key))))
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
