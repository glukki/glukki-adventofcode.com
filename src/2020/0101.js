const run = str => {
  return str.split('\n')
    .map(Number)
    .reduce((cargo, number) => {
      if (!cargo.result) {
        const needle = 2020 - number
        if (cargo.memo.has(needle)) {
          cargo.result = number * needle
        } else {
          cargo.memo.add(number)
        }
      }
      return cargo
    }, { memo: new Set(), result: null })
    .result
}

console.log(run(process.argv[2]))
