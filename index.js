const factor = 2
const w = 213 * factor
const h = 297 * factor
const gridSize = 20 * factor
const lineWeight = 4 * factor
const subGridSize = gridSize / 4
const numLines = 1000
let img
let updated = false

function display(imageMatrix) {
  loadPixels()
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      set(x, y, imageMatrix[x][y])
    }
  }
  updatePixels()
}

function stdNormalDistribution(x) {
  return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}

function distance(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

function gaussianMatrix(size, factor = 1) {
  if (size % 2 == 0)
    return new Error('size precisa sem impar')

  const radius = (size - 1) / 2

  const matrix = []

  for (let x = 0; x < size; x++) {
    matrix[x] = []
    for (let y = 0; y < size; y++) {
      matrix[x][y] = stdNormalDistribution(distance(x - radius, y - radius) * factor)
    }
  }
  return matrix
}

function preload() {
  img = loadImage('image.png')
}

function setup() {
  createCanvas(w, h);
  background(255)
  noFill()

  img.resize(w, h)
  img.loadPixels()

  imagePixels = []
  for (let x = 0; x < w; x++) {
    imagePixels[x] = []
    for (let y = 0; y < h; y++) {
      imagePixels[x][y] = img.get(x, y)
    }
  }
}

function draw() {
  if (!updated) {

    modifiedImage = rgbToMono(imagePixels)

    const gaussianBlurKernel = gaussianMatrix(5, 1)

    console.log(gaussianBlurKernel)

    // modifiedImage = Convolution2D(modifiedImage, gaussianBlurKernel)


    const xKernel = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ]

    const yKernel = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ]

    const xMatrix = convolution2D(modifiedImage, xKernel)
    const yMatrix = convolution2D(modifiedImage, yKernel)

    modifiedImage = sqrtMatrix(sumMatrix(squareMatrix(xMatrix), squareMatrix(yMatrix)))

    // modifiedImage = normalizeMatrix(modifiedImage)


    display(modifiedImage)

    updated = true
  }
}