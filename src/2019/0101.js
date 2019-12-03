const run = str => {
  return str
    .split('\n')
    .map(Number)
    .reduce((sum, num) => sum + (Math.floor(num / 3) - 2), 0)
}

console.log(run(process.argv[2]))
