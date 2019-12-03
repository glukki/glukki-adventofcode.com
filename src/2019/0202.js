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

const run = (desiredStr, memStr) => {
  const desired = Number(desiredStr)

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const mem = memStr.split(',').map(Number)
      mem[1] = noun
      mem[2] = verb

      const result = computer(mem)
      if (result === desired) {
        return noun * 100 + verb
      }
    }
  }

  return 'result not found'
}

console.log(run(process.argv[2], process.argv[3]))
