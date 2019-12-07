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

const compute = (memStr = '', inputValues = []) => {
  const mem = memStr.split(',').map(Number)

  const inputData = inputValues.slice()
  const inputFn = () => inputData.shift()

  const outputValues = []
  const outputFn = (value) => outputValues.push(value)

  let pointer = 0

  do {
    const { opcode, flags } = splitOpcodeAndFlags(mem[pointer])
    const fn = instructions[opcode]
    if (!fn) {
      return new Error('Opcode not found')
    }

    pointer = fn(mem, pointer, flags, inputFn, outputFn)

    if (pointer >= mem.length) {
      return new Error('Out of memory bounds')
    }
  } while (pointer !== null)

  return outputValues
}

const isAValidPhaseSetup = (digits = []) => {
  const seen = {}
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i]
    if (digit > 4) {
      return false
    }
    if (seen[digit]) {
      return false
    }
    seen[digit] = true
  }
  return true
}

const run = (memStr) => {
  let maxOut = -Infinity

  for (let i = 1234; i <= 43210; i++) {
    const phases = (i + '').padStart(5, '0').split('').map(Number)

    if (!isAValidPhaseSetup(phases)) {
      continue
    }

    debug('memStr %s', memStr)
    debug('phases %o', phases)
    const outA = compute(memStr, [phases[0], 0])[0]
    const outB = compute(memStr, [phases[1], outA])[0]
    const outC = compute(memStr, [phases[2], outB])[0]
    const outD = compute(memStr, [phases[3], outC])[0]
    const outE = compute(memStr, [phases[4], outD])[0]
    debug('outs %o', [outA, outB, outC, outD, outE])

    maxOut = Math.max(maxOut, outE)
  }

  return maxOut
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
    console.log(run(input.split('\n').join('')))
  })
