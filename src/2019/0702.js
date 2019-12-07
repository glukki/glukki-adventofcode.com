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

class Computer {
  constructor (memStr, phase, signal = 0) {
    this._mem = memStr.split(',').map(Number)
    this._pointer = 0
    this._output = []

    this._signal = signal
    this._phase = phase
    this._phaseRequested = false
    this._inputFn = () => {
      if (!this._phaseRequested) {
        this._phaseRequested = true
        return this._phase
      }
      return this._signal
    }

    this._outputFn = (value) => this._output.push(value)
  }

  _step () {
    const { opcode, flags } = splitOpcodeAndFlags(this._mem[this._pointer])
    const fn = instructions[opcode]
    if (!fn) {
      throw new Error('Opcode not found')
    }

    this._pointer = fn(this._mem, this._pointer, flags, this._inputFn, this._outputFn)

    if (this._pointer >= this._mem.length) {
      throw new Error('Out of memory bounds')
    }
  }

  getNextOutput () {
    while (!this._output.length && this._pointer !== null) {
      this._step()
    }
    return this._output.pop()
  }

  setSignal (value) {
    this._signal = value
  }

  hasEnded () {
    return this._pointer === null
  }
}

const isAValidPhaseSetup = (digits = []) => {
  const seen = {}
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i]
    if (digit < 5) {
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

  for (let i = 56789; i <= 98765; i++) {
    const phases = (i + '').padStart(5, '0').split('').map(Number)

    if (!isAValidPhaseSetup(phases)) {
      continue
    }

    debug('memStr %s', memStr)
    debug('phases %o', phases)

    const computers = [
      new Computer(memStr, phases[0], 0),
      new Computer(memStr, phases[1]),
      new Computer(memStr, phases[2]),
      new Computer(memStr, phases[3]),
      new Computer(memStr, phases[4]),
    ]

    let latestSignal = 0
    let counter = 0
    while (!computers[4].hasEnded()) {
      const index = counter % 5
      const nextIndex = (index + 1) % 5

      debug('indexes %d %d', index, nextIndex)
      const signal = computers[index].getNextOutput()
      if (signal) { // will get `undefined` on halt
        latestSignal = signal
        computers[nextIndex].setSignal(latestSignal)
      }
      counter++
    }

    maxOut = Math.max(maxOut, latestSignal)
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
