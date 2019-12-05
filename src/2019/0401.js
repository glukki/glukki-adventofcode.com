const tests = [
  (digits) => digits[0] === digits[1] ||
    digits[1] === digits[2] ||
    digits[2] === digits[3] ||
    digits[3] === digits[4] ||
    digits[4] === digits[5],
  (digits) => digits[0] <= digits[1] &&
    digits[1] <= digits[2] &&
    digits[2] <= digits[3] &&
    digits[3] <= digits[4] &&
    digits[4] <= digits[5],
]

const run = range => {
  const [min, max] = range.split('-')
    .map(Number)

  let found = 0
  for (let i = min; i <= max && i <= 999999; i++) {
    const digits = String(i)
    found += tests.every(test => test(digits))
  }

  return found
}

console.log(run(process.argv[2]))
