const computer = mem => {
  const instructions = {
    1: (mem, pointer) => {
      const [arg1, arg2, out] = mem.slice(pointer + 1, pointer + 4)
      mem[out] = mem[arg1] + mem[arg2]
      return pointer + 4
    },
    2: (mem, pointer) => {
      const [arg1, arg2, out] = mem.slice(pointer + 1, pointer + 4)
      mem[out] = mem[arg1] * mem[arg2]
      return pointer + 4
    }
  }

  let pointer = 0
  while (mem[pointer] !== 99) {
    const fn = instructions[mem[pointer]]
    if (!fn) {
      return null
    }
    pointer = fn(mem, pointer)
  }

  return mem[0]
}

const run = memStr => {
  const mem = memStr.split(',').map(Number)
  mem[1] = 12
  mem[2] = 2

  const result = computer(mem)
  if (result === null) {
    return 'result not found'
  }
  return result
}

console.log(run(process.argv[2]))
