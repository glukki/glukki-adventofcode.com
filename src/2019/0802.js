const debug = require('debug')('app')

const getLayersFromRawData = (dataStr = '', width, height) => {
  const layerSize = width * height
  const layers = []
  for (let i = 0; i < dataStr.length; i += layerSize) {
    layers.push(dataStr.substring(i, i + layerSize))
  }
  return layers
}

const getFirstVisiblePixel = (layers = [], offset = 0) => {
  for (let i = 0; i < layers.length; i++) {
    const pixel = layers[i][offset]
    if (pixel !== '2') {
      return pixel
    }
  }
  return 2 //transparent
}

const run = (dataStr = '') => {
  const [width, height] = [25, 6]
  const layers = getLayersFromRawData(dataStr, width, height)
  debug('layers %o', layers)

  const visibleImage = []
  for (let i = 0; i < width * height; i++) {
    visibleImage.push(getFirstVisiblePixel(layers, i))
  }
  debug('visibleImage, %o', visibleImage)

  const mappedLayer = visibleImage.map(pixel => {
    if (pixel === '0') {
      return '█'
    }
    if (pixel === '1') {
      return ' '
    }
    return ' '
  })
    .join('')

  return getLayersFromRawData(mappedLayer, width, 1).join('\n')
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
