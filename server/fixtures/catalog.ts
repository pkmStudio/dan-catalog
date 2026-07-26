export interface CatalogFixtureGroup {
  id: string
  name: string
  icon: string
  count: number
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
  name,
  icon,
  count: 48 - index
}))

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
  name: names[index % names.length] ?? names[0]!,
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
  oem: ['85212-0R040', '85222-0R040', '98350-2W100'],
  analogs: ['BOSCH AR601S', 'DENSO DF-010', 'LYNXauto LW600'],
  applications: [
    'TOYOTA CAMRY XV70 · 2018–2023',
    'TOYOTA RAV4 XA50 · 2019–2024',
    'HONDA CR-V RW · 2017–2022',
    'MAZDA CX-5 KF · 2017–2024',
    'NISSAN X-TRAIL T32 · 2015–2022',
    'SUBARU FORESTER SK · 2018–2024'
  ]
}))
