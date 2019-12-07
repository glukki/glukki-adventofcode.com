const debug = require('debug')('app')

const run = (str) => {
  const tree = str.split('\n')
    .map(join => join.split(')'))
    .reduce((tree, [parent, child]) => {
      tree[parent] = (tree[parent] || []).concat(child)
      return tree
    }, {})
  debug('tree %j', tree)

  const queue = [{ id: 'COM', distance: 0, parents: [] }]
  let pathToYou = null
  let pathToSan = null
  while (queue.length && !(pathToSan && pathToYou)) {
    const element = queue.shift()
    debug('element %o', element)

    if (element.id === 'YOU') {
      pathToYou = element
    }
    if (element.id === 'SAN') {
      pathToSan = element
    }

    (tree[element.id] || []).forEach(child => {
      queue.push({ id: child, distance: element.distance + 1, parents: element.parents.concat(element.id) })
    })
  }

  if (!pathToSan || !pathToYou) {
    return new Error('no path found')
  }

  const minPathLength = Math.min(pathToYou.parents.length, pathToSan.parents.length)
  let commonPathLength = 0
  for (let i = 0; i < minPathLength; i++) {
    if (pathToSan.parents[i] !== pathToYou.parents[i]) {
      break
    }
    commonPathLength = i
  }

  return pathToYou.distance + pathToSan.distance - commonPathLength * 2 - 2
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
    console.log(run(input))
  })
