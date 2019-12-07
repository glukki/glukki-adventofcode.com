const debug = require('debug')('app')

const splitOpcodeAndFlags = (num = '') => {
  const opcode = num % 100
  const flags = Math.floor(num / 100) + ''
  return { opcode, flags }
}

const parseModeFlags = (numberOfFlags = 0, str = '') => {
  return str.padStart(numberOfFlags, '0')
    .split('')
    .map(str => str === '1')
    .reverse()
}

const readParam = (mem, parameterPointer, immediateMode = false) => {
  const parameterValue = mem[parameterPointer]

  if (immediateMode) {
    return parameterValue
  }

  return mem[parameterValue]
}

const writeParam = (mem, parameterPointer, value) => {
  const parameterValue = mem[parameterPointer] // always a position mode
  return mem[parameterValue] = value
}

const instructions = {
  1: (mem, pointer, flagsStr) => {
    const nextCmd = pointer + 4
    debug('cmd sum %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    writeParam(mem, pointer + 3, value1 + value2)

    return nextCmd
  },
  2: (mem, pointer, flagsStr) => {
    const nextCmd = pointer + 4
    debug('cmd multiply %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    writeParam(mem, pointer + 3, value1 * value2)

    return nextCmd
  },
  3: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 2
    debug('cmd input %o', mem.slice(pointer, nextCmd))

    const value = input()
    debug('val %o', [value])

    writeParam(mem, pointer + 1, value)

    return nextCmd
  },
  4: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 2
    debug('cmd output %o', mem.slice(pointer, nextCmd))

    const [mode1] = parseModeFlags(1, flagsStr)
    debug('mod %o', [mode1])

    const value = readParam(mem, pointer + 1, mode1)
    debug('val %o', [value])

    output(value)

    return nextCmd
  },
  5: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 3
    debug('cmd jump-if-true %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    const result = value1 !== 0
    debug('res %d', result)

    return result ? value2 : nextCmd
  },
  6: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 3
    debug('cmd jump-if-false %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    const result = value1 === 0
    debug('res %d', result)

    return result ? value2 : nextCmd
  },
  7: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 4
    debug('cmd less-than %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    const result = value1 < value2 ? 1 : 0
    debug('res %d', result)

    writeParam(mem, pointer + 3, result)

    return nextCmd
  },
  8: (mem, pointer, flagsStr, input, output) => {
    const nextCmd = pointer + 4
    debug('cmd equals %o', mem.slice(pointer, nextCmd))

    const [mode1, mode2] = parseModeFlags(2, flagsStr)
    debug('mod %o', [mode1, mode2])

    const [value1, value2] = [readParam(mem, pointer + 1, mode1), readParam(mem, pointer + 2, mode2)]
    debug('val %o', [value1, value2])

    const result = value1 === value2 ? 1 : 0
    debug('res %d', result)

    writeParam(mem, pointer + 3, result)

    return nextCmd
  },
  99: (mem, pointer, flagsStr, input, output) => {
    debug('cmd %o', mem.slice(pointer, pointer + 1))
    return null
  },
}

const computer = (mem, input, output) => {
  let pointer = 0

  do {
    const { opcode, flags } = splitOpcodeAndFlags(mem[pointer])
    const fn = instructions[opcode]
    if (!fn) {
      return new Error('Opcode not found')
    }

    pointer = fn(mem, pointer, flags, input, output)

    if (pointer >= mem.length) {
      return new Error('Out of memory bounds')
    }
  } while (pointer !== null)
}

const getInput = (values) => {
  const data = values.slice() // clone array
  return () => data.shift()
}

const getOutput = () => {
  const data = []
  return {
    write: (value) => {
      data.push(value)
    },
    read: () => data,
  }
}

const run = (memStr, inputStr) => {
  const input = getInput(inputStr.split(',').map(Number))
  const output = getOutput()

  computer(memStr.split(',').map(Number), input, output.write)

  return output.read().slice(-1)[0]
}

console.log(run(process.argv[2], process.argv[3]))
