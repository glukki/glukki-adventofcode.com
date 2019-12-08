const debug = require('debug')('app')

const getLayersFromRawData = (dataStr = '', width, height) => {
  const layerSize = width * height
  const layers = []
  for (let i = 0; i < dataStr.length; i += layerSize) {
    layers.push(dataStr.substring(i, i + layerSize))
  }
  return layers
}

const run = (dataStr = '') => {
  const layers = getLayersFromRawData(dataStr, 25, 6)
  debug('layers %o', layers)

  const layersStats = layers.map(layerStr => {
    const stats = {
      0: 0,
      1: 0,
      2: 0,
    }
    return layerStr.split('')
      .reduce((stats = {}, char = '') => {
        stats[char] = (stats[char] || 0) + 1
        return stats
      }, stats)
  })
  debug('layersStats %o', layersStats)

  const searchedLayer = layersStats.sort((a, b) => a['0'] - b['0'])[0]
  debug('searchedLayer, %o', searchedLayer)

  return searchedLayer['1'] * searchedLayer['2']
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
