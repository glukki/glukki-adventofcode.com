const run = str => {
  return str
    .split('\n')
    .map(Number)
    .reduce((sum, num) => {
      while ((num = Math.floor(num / 3) - 2) > 0) {
        sum += num
      }
      return sum
    }, 0)
}

console.log(run(process.argv[2]))
