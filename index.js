const factor = 2
const w = 213 * factor
const h = 297 * factor
const gridSize = 20 * factor
const lineWeight = 4 * factor
const subGridSize = gridSize / 4
const numLines = 1000
let radiusSlider
let diffSlider
let img

const gpu = new GPU()
const getBorders = gpu.createKernel(function (img, radius, diff) {
  const baseColor = (
    img[this.thread.x][this.thread.y][0] +
    img[this.thread.x][this.thread.y][1] +
    img[this.thread.x][this.thread.y][2]
  ) / 3

  let finalColor = 255

  for (let nextX = -radius; nextX <= radius; nextX++) {
    for (let nextY = -radius; nextY <= radius; nextY++) {
      if (Math.sqrt(nextX ** 2 + nextY ** 2) < radius) {

        const nextBaseColor = (
          img[this.thread.x + nextX][this.thread.y + nextY][0] +
          img[this.thread.x + nextX][this.thread.y + nextY][1] +
          img[this.thread.x + nextX][this.thread.y + nextY][2]
        ) / 3
        if (Math.abs(baseColor - nextBaseColor) > diff) {
          finalColor = 0
        }
      }
    }
  }


  return finalColor
}).setOutput([w, h])

const filter = gpu.createKernel(function (img, radius) {
  const baseColor = img[this.thread.x][this.thread.y]

  let blackCounter = 0
  let whiteCounter = 0

  for (let nextX = -radius; nextX <= radius; nextX++) {
    for (let nextY = -radius; nextY <= radius; nextY++) {
      if (Math.sqrt(nextX ** 2 + nextY ** 2) < radius) {

        const nextBaseColor = img[this.thread.x + nextX][this.thread.y + nextY]

        if (nextBaseColor == 0) blackCounter ++
        if (nextBaseColor == 255) whiteCounter ++
      }
    }
  }


  if (whiteCounter > blackCounter) return 255
  else return 0

}).setOutput([h, w])


function preload() {
  img = loadImage('image.png')
}

function setup() {
  radiusSlider = createSlider(0, 10, 1.6, 0.1)
  diffSlider = createSlider(1, 50, 5.8, 0.1)
  filterRadiusSlider = createSlider(0, 10, 1.6, 0.1)
  createCanvas(w, h);
  background(255)
  noFill()

  img.resize(w, h)
  img.loadPixels()
  // image(img, 0, 0)

  imagePixels = []
  for (let x = 0; x < w; x++) {
    imagePixels[x] = []
    for (let y = 0; y < h; y++) {
      imagePixels[x][y] = img.get(x, y)
    }
  }
}

function draw() {
  background(255)


  const radius = radiusSlider.value()
  const diff = diffSlider.value()
  const filterRadius = filterRadiusSlider.value()

  console.log('radius', radius)
  console.log('diff', diff)
  console.log('filterRadius', filterRadius)

  const bordersPixels = getBorders(imagePixels, radius, diff)

  const filtered = filter(bordersPixels, filterRadius)


  // Visualize image borders map
  loadPixels()
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      set(x, y, filtered[x][y])
    }
  }
  updatePixels()

  stroke(0)
  strokeWeight(0.5)
  for (let x = 0; x < w; x += gridSize) {
    line(x, 0, x, h)
  }
  for (let y = 0; y < h; y += gridSize) {
    line(0, y, w, y)
  }

  stroke(0)
  strokeWeight(lineWeight)
  let drawedLines = Infinity

  while (drawedLines < numLines) {
    const initialX = random(w)
    const initialY = random(h)

    if (bordersPixels[floor(initialY)][floor(initialX)] == 0) {

      const angle = random(2 * PI)
      let toleratedError = 5

      let finalX = initialX
      let finalY = initialY

      while (true) {
        finalX += cos(angle)
        finalY += sin(angle)

        if (
          floor(finalX) < 0 ||
          floor(finalX) > h ||
          floor(finalY) < 0 ||
          floor(finalY) > w ||
          bordersPixels[floor(finalY)][floor(finalX)] == 255
        ) {
          toleratedError--
          if (toleratedError < 0) {

            const normalizedInitialX = round(initialX / subGridSize)
            const normalizedInitialY = round(initialY / subGridSize)
            const normalizedFinalX = round(finalX / subGridSize)
            const normalizedFinalY = round(finalY / subGridSize)

            if (normalizedInitialX != normalizedFinalX || normalizedInitialY != normalizedFinalY) {
              line(normalizedInitialX * subGridSize,
                normalizedInitialY * subGridSize,
                normalizedFinalX * subGridSize,
                normalizedFinalY * subGridSize)

              drawedLines++

              break
            }
          }
        }
      }
    }
  }

  // noLoop()
}