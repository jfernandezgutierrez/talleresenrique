const LOGO_URL = '/talleresEnriqueLogo.png'

let logoPromise

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo cargar la imagen para la marca de agua.'))
    image.src = source
  })
}

async function getLogo() {
  if (!logoPromise) logoPromise = loadImage(LOGO_URL)
  return logoPromise
}

function extensionForType(type) {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  return 'jpg'
}

export function watermarkedFilename(filename, type = 'image/jpeg') {
  const base = filename.replace(/\.[^.]+$/, '') || 'imagen'
  return `${base}-marca.${extensionForType(type)}`
}

export async function addWatermark(file, options = {}) {
  const { opacity = 0.62, size = 0.18, margin = 0.025 } = options
  const sourceUrl = URL.createObjectURL(file)

  try {
    const [source, logo] = await Promise.all([loadImage(sourceUrl), getLogo()])
    const canvas = document.createElement('canvas')
    canvas.width = source.naturalWidth
    canvas.height = source.naturalHeight

    const context = canvas.getContext('2d')
    context.drawImage(source, 0, 0)

    const inset = Math.max(12, Math.min(canvas.width, canvas.height) * margin)
    const logoRatio = logo.naturalHeight / logo.naturalWidth
    const logoWidth = Math.min(
      Math.max(40, canvas.width * size),
      canvas.width - inset * 2,
      (canvas.height - inset * 2) / logoRatio,
    )
    const logoHeight = logoWidth * logoRatio

    context.save()
    context.globalAlpha = opacity
    context.drawImage(
      logo,
      canvas.width - logoWidth - inset,
      canvas.height - logoHeight - inset,
      logoWidth,
      logoHeight,
    )
    context.restore()

    const outputType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      ? file.type
      : 'image/jpeg'
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('No se pudo generar la imagen.'))),
        outputType,
        0.92,
      )
    })

    return new File([blob], watermarkedFilename(file.name, outputType), {
      type: outputType,
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}
