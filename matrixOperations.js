function multiplyMatrixNumbers(m1, m2) {

  if (m1.length != m2.length || m1[0].length != m2[0].length)
    return new Error('matrizes precisam ser do mesmo tamanho')

  const mWidth = m1[0].length
  const mHeight = m1.length

  const gpuFunction = gpu.createKernel(function (m1, m2) {
    const x = this.thread.x
    const y = this.thread.y

    return m1[y][x] * m2[y][x]

  }).setOutput([mWidth, mHeight])

  return gpuFunction(m1, m2)
}


function sumMatrix(m1, m2) {

  if (m1.length != m2.length || m1[0].length != m2[0].length)
    return new Error('matrizes precisam ser do mesmo tamanho')

  const mWidth = m1[0].length
  const mHeight = m1.length

  const gpuFunction = gpu.createKernel(function (m1, m2) {
    const x = this.thread.x
    const y = this.thread.y

    return m1[y][x] + m2[y][x]

  }).setOutput([mWidth, mHeight])

  return gpuFunction(m1, m2)
}

function sqrtMatrix(m) {
  const mWidth = m[0].length
  const mHeight = m.length

  const gpuFunction = gpu.createKernel(function (m) {
    const x = this.thread.x
    const y = this.thread.y

    return Math.sqrt(m[y][x])

  }).setOutput([mWidth, mHeight])

  return gpuFunction(m)
}

function squareMatrix(m) {
  const mWidth = m[0].length
  const mHeight = m.length

  const gpuFunction = gpu.createKernel(function (m) {
    const x = this.thread.x
    const y = this.thread.y

    return Math.pow(m[y][x], 2)

  }).setOutput([mWidth, mHeight])

  return gpuFunction(m)
}

function normalizeMatrix(m) {
  const mWidth = m[0].length
  const mHeight = m.length

  let minVal = Infinity
  let maxVal = -Infinity

  for (a in m) {
    for (b in a) {
      if (b < minVal) minVal = b
      if (b > maxVal) maxVal = b
    }
  }

  console.log(minVal, maxVal)

  const diff = maxVal - minVal

  const factor = 1 / diff

  const gpuFunction = gpu.createKernel(function (m, minVal, factor) {
    const x = this.thread.x
    const y = this.thread.y

    return (m[y][x] - minVal) * factor

  }).setOutput([mWidth, mHeight])

  console.log('kdagfkasgkdaskg')

  return gpuFunction(m, minVal, factor)
}

function multiplyMatrixByNumber(m, number) {
  const mWidth = m[0].length
  const mHeight = m.length

  const gpuFunction = gpu.createKernel(function (m, number) {
    const x = this.thread.x
    const y = this.thread.y

    return m[y][x] * number

  }).setOutput([mWidth, mHeight])

  return gpuFunction(m, number)
}