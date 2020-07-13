const gpu = new GPU()

function Convolution2D(matrix, kernel) {
  const matrixWidth = matrix[0].length
  const matrixHeight = matrix.length

  if (kernel.length != kernel[0].length)
    return new Error('kernel precisa ser quadrado')

  if (kernel.length % 2 == 0)
    return new Error('tamanho do kernel precisa ser impar')

  const kernelSize = kernel.length
  const halfKernelSize = (kernelSize - 1) / 2

  let kernelSum = 0
  for (a of kernel) {
    for (b of a) {
      kernelSum += b
    }
  }

  const gpuFunction = gpu.createKernel(function (
    matrix,
    matrixWidth,
    matrixHeight,
    kernel,
    _kernelSize,
    halfKernelSize,
    kernelSum
  ) {
    const x = this.thread.x
    const y = this.thread.y

    let result = 0

    for (let xDist = 0; xDist < _kernelSize; xDist++) {
      for (let yDist = 0; yDist < _kernelSize; yDist++) {
        const kernelValue = kernel[xDist][yDist]
        let matrixValue = 0

        const xMatrix = x + xDist - halfKernelSize
        const yMatrix = y + yDist - halfKernelSize

        if (xMatrix >= 0 && xMatrix < matrixWidth && yMatrix >= 0 && yMatrix < matrixHeight) {
          matrixValue = matrix[yMatrix][xMatrix]
        }

        result += kernelValue * matrixValue
      }
    }

    return result / kernelSum

  }).setOutput([matrixWidth,
    matrixHeight])

  return gpuFunction(
    matrix,
    matrixWidth,
    matrixHeight,
    kernel,
    kernelSize,
    halfKernelSize,
    kernelSum
  )
}

// test
// console.log(Convolution2D([[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
//   [[1, 1, 1], [1, 1, 1], [1, 1, 1]]))