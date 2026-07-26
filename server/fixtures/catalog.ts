export interface CatalogFixtureGroup {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  sortOrder: number
  categoryCount: number
}

export interface CatalogFixtureCategory {
  id: string
  groupId: string
  slug: string
  name: string
  description: string
  image: string
  productCount: number
  filterFacets: CatalogFixtureFacet[]
}

export interface CatalogFixtureFacet {
  key: string
  label: string
  kind: 'enum' | 'number'
  options: Array<{ value: string; label: string; count: number }>
}

export interface CatalogFixtureProduct {
  id: string
  sku: string
  name: string
  categoryId: string
  image: string
  images: string[]
  type: string
  side: string
  length: number
  mount: string
  material: string
  warranty: string
  description: string
  oem: string[]
  analogs: string[]
  applications: string[]
}

const groupData: Array<[string, string, string]> = [
  ['brakes', 'Тормозная система', 'circle-stop'],
  ['steering', 'Рулевое управление и подвеска', 'waypoints'],
  ['fasteners', 'Крепёж', 'nut'],
  ['shocks', 'Амортизаторы и пружины', 'move-vertical'],
  ['belts', 'Ремни и приводные компоненты', 'refresh-cw'],
  ['timing', 'Цепи и компоненты ГРМ', 'link'],
  ['bearings', 'Ступичные подшипники', 'circle-dot'],
  ['transmission', 'Трансмиссия и привод', 'settings'],
  ['mounts', 'Опоры двигателя и КПП', 'box'],
  ['cooling', 'Система охлаждения', 'snowflake'],
  ['fuel', 'Топливная система', 'fuel'],
  ['ignition', 'Система зажигания', 'zap'],
  ['batteries', 'Аккумуляторы', 'battery-charging'],
  ['sensors', 'Датчики', 'gauge'],
  ['lamps', 'Лампы', 'lightbulb'],
  ['wipers', 'Щетки стеклоочистителя', 'wind']
]

export const groups: CatalogFixtureGroup[] = groupData.map(([id, name, icon], index) => ({
  id,
  slug: id,
  name,
  description: `Категории раздела «${name}»`,
  icon,
  sortOrder: index,
  categoryCount: id === 'wipers' ? 2 : id === 'brakes' ? 2 : 0
}))

export const wiperFacets: CatalogFixtureFacet[] = [
  {
    key: 'type',
    label: 'Тип щётки',
    kind: 'enum',
    options: ['Бескаркасная', 'Каркасная', 'Гибридная'].map((value) => ({
      value,
      label: value,
      count: 16
    }))
  },
  {
    key: 'side',
    label: 'Сторона установки',
    kind: 'enum',
    options: [
      { value: 'Передняя', label: 'Передняя', count: 38 },
      { value: 'Задняя', label: 'Задняя', count: 10 }
    ]
  },
  {
    key: 'length',
    label: 'Длина, мм',
    kind: 'number',
    options: [300, 400, 500, 600].map((value) => ({
      value: String(value),
      label: String(value),
      count: 12
    }))
  },
  {
    key: 'mount',
    label: 'Крепление',
    kind: 'enum',
    options: ['Hook', 'Push Button', 'Pinch Tab'].map((value) => ({
      value,
      label: value,
      count: 16
    }))
  }
]

export const categories: CatalogFixtureCategory[] = [
  {
    id: 'wipers',
    groupId: 'wipers',
    slug: 'wipers',
    name: 'Щётки стеклоочистителя',
    description: 'Щётки разных типов, размеров и вариантов крепления.',
    image: '/images/generated-1784981127693.png',
    productCount: 48,
    filterFacets: wiperFacets
  },
  {
    id: 'wiper-accessories',
    groupId: 'wipers',
    slug: 'wiper-accessories',
    name: 'Аксессуары для щёток',
    description: 'Демонстрационная пустая категория.',
    image: '/images/generated-1784981127652.png',
    productCount: 0,
    filterFacets: []
  },
  {
    id: 'brake-pads',
    groupId: 'brakes',
    slug: 'brake-pads',
    name: 'Тормозные колодки',
    description: 'Колодки для легковых автомобилей.',
    image: '/images/generated-1784981129280.png',
    productCount: 0,
    filterFacets: []
  },
  {
    id: 'brake-discs',
    groupId: 'brakes',
    slug: 'brake-discs',
    name: 'Тормозные диски',
    description: 'Диски штатных размеров.',
    image: '/images/generated-1784981129826.png',
    productCount: 0,
    filterFacets: []
  }
]

const images = [
  '/images/generated-1784981127693.png',
  '/images/generated-1784981127652.png',
  '/images/generated-1784981129280.png',
  '/images/generated-1784981129826.png',
  '/images/generated-1784981131034.png',
  '/images/generated-1784981131514.png',
  '/images/generated-1784981132633.png',
  '/images/generated-1784981132692.png'
]

const names = [
  'Щётка стеклоочистителя DAN 400 мм',
  'Щётка стеклоочистителя DAN 500 мм',
  'Щётка стеклоочистителя DAN 600 мм',
  'Щётка бескаркасная DAN Aero 600 мм',
  'Щётка гибридная DAN 500 мм',
  'Щётка заднего стекла DAN 350 мм',
  'Комплект щёток DAN Twin 600/450',
  'Щётка стеклоочистителя DAN Premium'
]

export const products: CatalogFixtureProduct[] = Array.from({ length: 48 }, (_, index) => ({
  id: index === 0 ? 'lw-600' : `dan-wb-${String(index + 1).padStart(3, '0')}`,
  sku: index === 0 ? 'LW-600' : `DAN-WB-${String(index + 1).padStart(3, '0')}`,
  name:
    index === 0
      ? 'Щётка стеклоочистителя бескаркасная DAN 600 мм'
      : (names[index % names.length] ?? names[0]!),
  categoryId: 'wipers',
  image: images[index % images.length] ?? images[0]!,
  images:
    index === 0
      ? [
          '/images/generated-1784981152886.png',
          '/images/generated-1784981560925.png',
          '/images/generated-1784981561799.png',
          '/images/generated-1784981561547.png'
        ]
      : [images[index % images.length] ?? images[0]!],
  type: ['Бескаркасная', 'Каркасная', 'Гибридная'][index % 3] ?? 'Бескаркасная',
  side: index % 5 === 0 ? 'Задняя' : 'Передняя',
  length: [300, 400, 500, 600][index % 4] ?? 400,
  mount: ['Hook', 'Push Button', 'Pinch Tab'][index % 3] ?? 'Hook',
  material: 'Натуральный каучук с графитом',
  warranty: '12 месяцев',
  description:
    'Бескаркасная щетка стеклоочистителя с универсальным адаптером. Обеспечивает равномерный прижим по всей длине и чистую работу в любую погоду.',
  oem: index === 47 ? [] : ['85212-0R040', '85222-0R040', '98350-2W100'],
  analogs: index === 47 ? [] : ['BOSCH AR601S', 'DENSO DF-010', 'LYNXauto LW600'],
  applications:
    index === 46
      ? []
      : [
          'TOYOTA CAMRY XV70 · 2018–2023',
          'TOYOTA RAV4 XA50 · 2019–2024',
          'HONDA CR-V RW · 2017–2022',
          'MAZDA CX-5 KF · 2017–2024',
          'NISSAN X-TRAIL T32 · 2015–2022',
          'SUBARU FORESTER SK · 2018–2024'
        ]
}))
