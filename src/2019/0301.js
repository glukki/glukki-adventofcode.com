const directionMap = {
  U: (prev, offset) => ({ ...prev, y: prev.y + offset }),
  D: (prev, offset) => ({ ...prev, y: prev.y - offset }),
  L: (prev, offset) => ({ ...prev, x: prev.x - offset }),
  R: (prev, offset) => ({ ...prev, x: prev.x + offset }),
}
const pathToCoordinates = path => {
  let prev = { x: 0, y: 0 }
  return [prev].concat(path.map(pathElement => {
    const direction = pathElement[0]
    const offset = Number(pathElement.substr(1))
    const coordinate = directionMap[direction](prev, offset)
    prev = coordinate
    return coordinate
  }))
}

const isHorizontal = (start, end) => {
  return start.y === end.y
}

const getCrossPoint = (lineA, lineB) => {
  const isAHorizontal = isHorizontal(...lineA)
  if (isAHorizontal === isHorizontal(...lineB)) {
    // line is either vertical or horisontal
    // parallel lines don't cross
    return null
  }

  const [horizontalLine, verticalLine] = isAHorizontal ? [lineA, lineB] : [lineB, lineA]

  const asc = (a, b) => (a - b)
  const sortedX = horizontalLine.map(point => point.x).sort(asc)
  const sortedY = verticalLine.map(point => point.y).sort(asc)

  const cross = { x: verticalLine[0].x, y: horizontalLine[0].y }

  if (!(sortedX[0] <= cross.x && cross.x <= sortedX[1])) {
    return null
  }

  if (!(sortedY[0] <= cross.y && cross.y <= sortedY[1])) {
    return null
  }

  return cross
}

const getDistance = (cross) => {
  return Math.abs(cross.x) + Math.abs(cross.y)
}

const getClosestCrossDistance = (coordsA, coordsB) => {
  let minCrossDistance = null

  for (let i = 1; i < coordsA.length; i++) {
    for (let j = 1; j < coordsB.length; j++) {
      if (i === 1 && j === 1) {
        // first lines cross at 0, but that souldn't count
        // the rest of lines should be compared with first lines
        continue
      }

      const lineA = [coordsA[i - 1], coordsA[i]]
      const lineB = [coordsB[j - 1], coordsB[j]]
      const cross = getCrossPoint(lineA, lineB)
      if (!cross) {
        continue
      }

      const distance = getDistance(cross)
      if (distance < (minCrossDistance || +Infinity)) {
        minCrossDistance = distance
      }
    }
  }

  return minCrossDistance
}

const run = paths => {
  const [coordsA, coordsB] = paths.split('\n')
    .map(pathStr => (pathStr || '').trim().split(','))
    .map(pathToCoordinates)

  const minDistance = getClosestCrossDistance(coordsA, coordsB)
  if (minDistance === null) {
    return 'no cross found'
  }

  return minDistance
}

console.log(run(process.argv[2]))
