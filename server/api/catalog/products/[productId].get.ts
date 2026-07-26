import { eventHandler, getRouterParam } from 'h3'
import { catalogProducts as products } from '../../../fixtures'
import { mockDelay } from '../../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../../utils/mock-response'

export const buildProductResponse = (productId: string | undefined) => {
  const product = products.find(
    (item) =>
      item.id === productId || item.sku.toLocaleLowerCase() === productId?.toLocaleLowerCase()
  )
  if (!product) {
    return throwMockError(404, {
      code: 'PRODUCT_NOT_FOUND',
      message: 'Товар не найден.'
    })
  }

  const productIndex = products.indexOf(product)
  const linkedAnalog = products[(productIndex + 1) % products.length]

  return mockResponse({
    id: product.id,
    sku: product.sku,
    name: product.name,
    image: product.image,
    categoryId: product.categoryId,
    description: product.description,
    images: product.images.map((src, sortOrder) => ({
      src,
      alt: `${product.name}, изображение ${sortOrder + 1}`,
      thumbnailSrc: src,
      sortOrder
    })),
    specifications: [
      { key: 'length', label: 'Длина', value: product.length, unit: 'мм', filterable: true },
      { key: 'type', label: 'Тип', value: product.type, filterable: true },
      { key: 'side', label: 'Сторона установки', value: product.side, filterable: true },
      { key: 'mount', label: 'Крепление', value: product.mount, filterable: true },
      { key: 'material', label: 'Материал', value: product.material, filterable: false },
      { key: 'warranty', label: 'Гарантия', value: product.warranty, filterable: false }
    ],
    oemNumbers: product.oem,
    analogs: product.analogs.map((label, index) => ({
      id: `${product.id}-analog-${index + 1}`,
      sku: index === 0 && linkedAnalog ? linkedAnalog.sku : label.split(' ').slice(1).join(' '),
      name: label,
      ...(index === 0 && linkedAnalog ? { productId: linkedAnalog.id } : {}),
      manufacturer: label.split(' ')[0]
    })),
    applications: product.applications.map((label, index) => ({
      modificationId: `demo-modification-${index + 1}`,
      label
    })),
    seo: {
      title: `${product.name} — каталог DAN`,
      description: `${product.name}, артикул ${product.sku}: характеристики и применяемость.`,
      canonicalPath: `/product/${product.id}`
    }
  })
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildProductResponse(getRouterParam(event, 'productId'))
})
