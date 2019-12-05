const directionMap = {
  U: (prev, offset) => ({ ...prev, y: prev.y + offset }),
  D: (prev, offset) => ({ ...prev, y: prev.y - offset }),
  L: (prev, offset) => ({ ...prev, x: prev.x - offset }),
  R: (prev, offset) => ({ ...prev, x: prev.x + offset }),
}
const pathToLines = (path) => {
  let previousPoint = { x: 0, y: 0 }
  let previousLength = 0

  return path.map(pathElement => {
    const direction = pathElement[0]
    const offset = Number(pathElement.substr(1))

    const point = directionMap[direction](previousPoint, offset)
    const line = [previousPoint, point, previousLength]

    previousPoint = point
    previousLength += offset

    return line
  })
}

const isHorizontal = (line) => {
  return line[0].y === line[1].y
}

const getCrossPoint = (lineA, lineB) => {
  const isLineAHorizontal = isHorizontal(lineA)
  if (isLineAHorizontal === isHorizontal(lineB)) {
    // line is either vertical or horisontal
    // parallel lines don't cross
    return null
  }

  const [horizontalLine, verticalLine] = isLineAHorizontal ? [lineA, lineB] : [lineB, lineA]

  const asc = (a, b) => (a - b)
  const sortedX = [horizontalLine[0].x, horizontalLine[1].x].sort(asc)
  const sortedY = [verticalLine[0].y, verticalLine[1].y].sort(asc)

  const cross = {
    x: verticalLine[0].x,
    y: horizontalLine[0].y,
    length: lineA[2] // path A previous length
      + lineB[2] // path B previous length
      + Math.abs(verticalLine[0].y - horizontalLine[0].y) // from start of vertical line to horizontal line
      + Math.abs(horizontalLine[0].x - verticalLine[0].x), // from start of horizontal line to vertical line
  }

  if (!(sortedX[0] <= cross.x && cross.x <= sortedX[1])) {
    return null
  }

  if (!(sortedY[0] <= cross.y && cross.y <= sortedY[1])) {
    return null
  }

  return cross
}

const getShortestPathLengthToCross = (linesA, linesB) => {
  let minLength = +Infinity

  for (let a = 0; a < linesA.length; a++) {
    for (let b = 0; b < linesB.length; b++) {
      if (a === 0 && b === 0) {
        // first lines cross at 0, but that souldn't count
        // the rest of lines should be compared with first lines
        continue
      }

      const cross = getCrossPoint(linesA[a], linesB[b])
      if (!cross) {
        continue
      }

      minLength = Math.min(minLength, cross.length)
    }
  }

  return minLength
}

const run = paths => {
  const [linesA, linesB] = paths.split('\n')
    .map(pathStr => (pathStr || '').trim().split(','))
    .map(pathToLines)

  const minDistance = getShortestPathLengthToCross(linesA, linesB)
  if (minDistance === +Infinity) {
    return 'no cross found'
  }

  return minDistance
}

console.log(run(process.argv[2]))
