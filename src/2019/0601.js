const debug = require('debug')('app')

const run = (str) => {
  const tree = str.split('\n')
    .map(join => join.split(')'))
    .reduce((tree, [parent, child]) => {
      tree[parent] = (tree[parent] || []).concat(child)
      return tree
    }, {})
  debug('tree %j', tree)

  const queue = [{ id: 'COM', distance: 0 }]
  let result = 0
  while (queue.length) {
    const element = queue.shift()
    result += element.distance;
    (tree[element.id] || []).forEach(child => {
      queue.push({ id: child, distance: element.distance + 1 })
    })
  }

  return result
}

console.log(run(process.argv[2]))
