function rgbToMono(image) {
  const imageWidth = image[0].length
  const imageHeight = image.length

  const gpuFunction = gpu.createKernel(function (image) {
    const x = this.thread.x
    const y = this.thread.y

    return (image[y][x][0] + image[y][x][1] + image[y][x][2]) / 3

  }).setOutput([imageWidth, imageHeight])

  return gpuFunction(image)
}