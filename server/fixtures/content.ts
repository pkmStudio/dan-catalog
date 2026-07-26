export interface ContentSectionFixture {
  heading: string
  body: string
}

export const aboutContent = {
  heading: 'О компании DAN',
  lead: 'Демонстрационный текст о бренде. Требуется замена на утверждённый контент.',
  sections: [
    {
      heading: 'Каталог автотоваров',
      body: 'DAN помогает подобрать автотовары по каталогу и параметрам автомобиля.'
    }
  ] satisfies ContentSectionFixture[]
}

export const contactContent = {
  phone: '+7 000 000-00-00',
  email: 'demo@example.com',
  address: 'Демонстрационный адрес — требуется уточнение',
  workingHours: 'Демонстрационный график — требуется уточнение',
  supportNote: 'Контактные данные являются демонстрационными и будут заменены владельцем каталога.'
}
