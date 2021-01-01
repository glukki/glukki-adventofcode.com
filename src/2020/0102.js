const run = str => {
  return str.split('\n')
    .map(Number)
    .reduce((cargo, number, i, arr) => {
      const sum = 2020

      if (cargo.result || number >= sum) {
        return cargo
      }

      const rem = sum - number
      for (const a of cargo.memo.values()) {
        if (a < rem) {
          const needle = rem - a
          if (cargo.memo.has(needle)) {
            cargo.result = number * a * needle
            return cargo
          }
        }
      }

      cargo.memo.add(number)

      return cargo
    }, { memo: new Set(), result: 0 })
    .result
}

console.log(run(process.argv[2]))
