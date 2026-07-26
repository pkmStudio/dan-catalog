import type { Product, ProductGroup, VehicleMake, VehicleModel } from '~/types/catalog'

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

export const groups: ProductGroup[] = groupData.map(([id, name, icon], i) => ({
  id,
  name,
  icon,
  count: 48 - i
}))
const imgs = [
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
export const products: Product[] = Array.from({ length: 48 }, (_, i) => ({
  id: i === 0 ? 'lw-600' : `dan-wb-${String(i + 1).padStart(3, '0')}`,
  sku: i === 0 ? 'LW-600' : `DAN-WB-${String(i + 1).padStart(3, '0')}`,
  name: names[i % names.length]!,
  categoryId: 'wipers',
  image: imgs[i % imgs.length]!,
  images:
    i === 0
      ? [
          '/images/generated-1784981152886.png',
          '/images/generated-1784981560925.png',
          '/images/generated-1784981561799.png',
          '/images/generated-1784981561547.png'
        ]
      : [imgs[i % imgs.length]!],
  type: ['Бескаркасная', 'Каркасная', 'Гибридная'][i % 3]!,
  side: i % 5 === 0 ? 'Задняя' : 'Передняя',
  length: [300, 400, 500, 600][i % 4]!,
  mount: ['Hook', 'Push Button', 'Pinch Tab'][i % 3]!,
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
export const makes: VehicleMake[] = [
  'Toyota',
  'Honda',
  'Mazda',
  'Nissan',
  'Subaru',
  'Kia',
  'Hyundai',
  'Volkswagen'
].map((name) => ({
  id: name.toLowerCase(),
  name
}))
export const models: VehicleModel[] = [
  {
    id: 'camry',
    makeId: 'toyota',
    name: 'Camry',
    generations: ['XV70 · 2.5 бензин · 181 л.с. · 2018–2023', 'XV50 · 2.5 бензин · 2011–2017']
  },
  {
    id: 'rav4',
    makeId: 'toyota',
    name: 'RAV4',
    generations: ['XA50 · 2.0 бензин · 2019–2024', 'XA40 · 2.5 бензин · 2013–2019']
  },
  {
    id: 'corolla',
    makeId: 'toyota',
    name: 'Corolla',
    generations: ['E210 · 1.6 бензин · 2018–2024']
  },
  {
    id: 'crv',
    makeId: 'honda',
    name: 'CR-V',
    generations: ['RW · 2.4 бензин · 2017–2022']
  },
  { id: 'cx5', makeId: 'mazda', name: 'CX-5', generations: ['KF · 2.5 бензин · 2017–2024'] }
]
export const delay = () => new Promise((resolve) => setTimeout(resolve, 180))
