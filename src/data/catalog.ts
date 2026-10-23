export type Category = {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  sortOrder: number
  isActive: boolean
}

export type ProductImage = {
  id: string
  url: string
  alt: string
  sortOrder: number
}

export type ProductAttribute = {
  id: string
  name: string
  value: string
  unit: string
  sortOrder: number
}

export type Product = {
  id: string
  categoryId: string
  brand: string
  name: string
  slug: string
  shortDescription: string
  description: string
  priceUzs: number
  oldPriceUzs: number | null
  sku: string
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
  images: ProductImage[]
  attributes: ProductAttribute[]
}

export const categories: Category[] = [
  {
    id: "cat-fridge",
    name: "Холодильники",
    slug: "holodilniki",
    description: "Холодильники и морозильные камеры для квартиры.",
    imageUrl: "/products/artel-hd345rnd-eco.webp",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-washer",
    name: "Стиральные машины",
    slug: "stiralnye-mashiny",
    description: "Стиральные машины с фронтальной загрузкой.",
    imageUrl: "/products/lg-f2t9gw9p.webp",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-vacuum",
    name: "Пылесосы",
    slug: "pylesosy",
    description: "Пылесосы для пола и мебели.",
    imageUrl: "/products/lg-vk69662n.webp",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-ac",
    name: "Кондиционеры",
    slug: "konditsionery",
    description: "Сплит-системы для комнат в Ташкенте.",
    imageUrl: "/products/artel-12hs-s-sir1w12be.webp",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-kitchen",
    name: "Кухня",
    slug: "kuhnya",
    description: "Мелкая техника для кухни.",
    imageUrl: "/products/polaris-pwk-1759cgl.webp",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "cat-tv",
    name: "Телевизоры",
    slug: "televizory",
    description: "Телевизоры для гостиной.",
    imageUrl: "/products/artel-ua43h3502-smart.webp",
    sortOrder: 6,
    isActive: true,
  },
]

export const products: Product[] = [
  {
    id: "prd-105431",
    categoryId: "cat-fridge",
    brand: "Artel",
    name: "Холодильник Artel HD345RND Eco Белый",
    slug: "artel-hd345rnd-eco",
    shortDescription: "Объём 265 л, Размораживание морозильной камеры Капельное.",
    description: "Объём 265 л, Размораживание морозильной камеры Капельное. Продаётся в Ташкенте.",
    priceUzs: 4_197_000,
    oldPriceUzs: null,
    sku: "00026057",
    stockQuantity: 8,
    isActive: true,
    isFeatured: true,
    images: [
      {
        id: "img-artel-hd345rnd-eco",
        url: "/products/artel-hd345rnd-eco.webp",
        alt: "Холодильник Artel HD345RND Eco Белый",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "artel-hd345rnd-eco-1",
        name: "Объём",
        value: "265",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "artel-hd345rnd-eco-2",
        name: "Размораживание морозильной камеры",
        value: "Капельное",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "artel-hd345rnd-eco-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-96515",
    categoryId: "cat-fridge",
    brand: "Artel",
    name: "Холодильник Artel HD455 RWENE Белый",
    slug: "artel-hd455-rwene",
    shortDescription: "Объём 350 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 350 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 7_321_000,
    oldPriceUzs: null,
    sku: "00013968",
    stockQuantity: 1,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-artel-hd455-rwene",
        url: "/products/artel-hd455-rwene.webp",
        alt: "Холодильник Artel HD455 RWENE Белый",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "artel-hd455-rwene-1",
        name: "Объём",
        value: "350",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "artel-hd455-rwene-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "artel-hd455-rwene-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-358865",
    categoryId: "cat-fridge",
    brand: "Ferre",
    name: "Холодильник Ferre FNF-470 I",
    slug: "ferre-fnf-470-i",
    shortDescription: "Объём 356 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 356 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 5_513_000,
    oldPriceUzs: null,
    sku: "00031674",
    stockQuantity: 6,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-ferre-fnf-470-i",
        url: "/products/ferre-fnf-470-i.webp",
        alt: "Холодильник Ferre FNF-470 I",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "ferre-fnf-470-i-1",
        name: "Объём",
        value: "356",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "ferre-fnf-470-i-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "ferre-fnf-470-i-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-86973",
    categoryId: "cat-fridge",
    brand: "Samsung",
    name: "Холодильник Samsung RB29FERNDSA",
    slug: "samsung-rb29ferndsa",
    shortDescription: "Объём 290 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 290 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 8_199_000,
    oldPriceUzs: null,
    sku: "00000445",
    stockQuantity: 39,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-rb29ferndsa",
        url: "/products/samsung-rb29ferndsa.webp",
        alt: "Холодильник Samsung RB29FERNDSA",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-rb29ferndsa-1",
        name: "Объём",
        value: "290",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "samsung-rb29ferndsa-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "samsung-rb29ferndsa-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-359752",
    categoryId: "cat-fridge",
    brand: "LG",
    name: "Холодильник LG GC-B459ETKM",
    slug: "lg-gc-b459etkm",
    shortDescription: "Объём 333 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 333 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 8_901_000,
    oldPriceUzs: null,
    sku: "00032589",
    stockQuantity: 14,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-gc-b459etkm",
        url: "/products/lg-gc-b459etkm.webp",
        alt: "Холодильник LG GC-B459ETKM",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-gc-b459etkm-1",
        name: "Объём",
        value: "333",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "lg-gc-b459etkm-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "lg-gc-b459etkm-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-358873",
    categoryId: "cat-fridge",
    brand: "Premier",
    name: "Холодильник Premier PRM-350TFNFID/I",
    slug: "premier-prm-350tfnfid-i",
    shortDescription: "Объём 348 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 348 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 6_175_000,
    oldPriceUzs: null,
    sku: "00031704",
    stockQuantity: 26,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-premier-prm-350tfnfid-i",
        url: "/products/premier-prm-350tfnfid-i.webp",
        alt: "Холодильник Premier PRM-350TFNFID/I",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "premier-prm-350tfnfid-i-1",
        name: "Объём",
        value: "348",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "premier-prm-350tfnfid-i-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358294",
    categoryId: "cat-fridge",
    brand: "Haier",
    name: "Холодильник Haier C2F637CXRGU1",
    slug: "haier-c2f637cxrgu1",
    shortDescription: "Объём 386 л, Размораживание морозильной камеры No Frost.",
    description: "Объём 386 л, Размораживание морозильной камеры No Frost. Продаётся в Ташкенте.",
    priceUzs: 8_398_000,
    oldPriceUzs: null,
    sku: "00030525",
    stockQuantity: 4,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-haier-c2f637cxrgu1",
        url: "/products/haier-c2f637cxrgu1.webp",
        alt: "Холодильник Haier C2F637CXRGU1",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "haier-c2f637cxrgu1-1",
        name: "Объём",
        value: "386",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "haier-c2f637cxrgu1-2",
        name: "Размораживание морозильной камеры",
        value: "No Frost",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "haier-c2f637cxrgu1-3",
        name: "Количество камер",
        value: "2",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-358343",
    categoryId: "cat-fridge",
    brand: "Premier",
    name: "Холодильник Premier PRM-222TFDF/W",
    slug: "premier-prm-222tfdf-w",
    shortDescription: "Объём 222 л, Размораживание морозильной камеры De Frost.",
    description: "Объём 222 л, Размораживание морозильной камеры De Frost. Продаётся в Ташкенте.",
    priceUzs: 2_589_000,
    oldPriceUzs: null,
    sku: "00030816",
    stockQuantity: 20,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-premier-prm-222tfdf-w",
        url: "/products/premier-prm-222tfdf-w.webp",
        alt: "Холодильник Premier PRM-222TFDF/W",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "premier-prm-222tfdf-w-1",
        name: "Объём",
        value: "222",
        unit: "л",
        sortOrder: 1,
      },
      {
        id: "premier-prm-222tfdf-w-2",
        name: "Размораживание морозильной камеры",
        value: "De Frost",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-81771",
    categoryId: "cat-washer",
    brand: "LG",
    name: "Стиральная машина LG F2T9GW9P",
    slug: "lg-f2t9gw9p",
    shortDescription: "Загрузка 8,5 кг, Отжим 1200 об/мин.",
    description: "Загрузка 8,5 кг, Отжим 1200 об/мин. Продаётся в Ташкенте.",
    priceUzs: 6_999_000,
    oldPriceUzs: null,
    sku: "00001380",
    stockQuantity: 24,
    isActive: true,
    isFeatured: true,
    images: [
      {
        id: "img-lg-f2t9gw9p",
        url: "/products/lg-f2t9gw9p.webp",
        alt: "Стиральная машина LG F2T9GW9P",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-f2t9gw9p-1",
        name: "Загрузка",
        value: "8,5",
        unit: "кг",
        sortOrder: 1,
      },
      {
        id: "lg-f2t9gw9p-2",
        name: "Отжим",
        value: "1200",
        unit: "об/мин",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-359045",
    categoryId: "cat-washer",
    brand: "Samsung",
    name: "Стиральная машина Samsung WW80AGAS22AXLD",
    slug: "samsung-ww80agas22axld",
    shortDescription: "Загрузка 8 кг.",
    description: "Загрузка 8 кг. Продаётся в Ташкенте.",
    priceUzs: 5_799_000,
    oldPriceUzs: null,
    sku: "00031782",
    stockQuantity: 21,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-ww80agas22axld",
        url: "/products/samsung-ww80agas22axld.webp",
        alt: "Стиральная машина Samsung WW80AGAS22AXLD",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-ww80agas22axld-1",
        name: "Загрузка",
        value: "8",
        unit: "кг",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "prd-357610",
    categoryId: "cat-washer",
    brand: "Haier",
    name: "Стиральная машина Haier HW80-B14279S",
    slug: "haier-hw80-b14279s",
    shortDescription: "Загрузка 8 кг, Отжим 1400 об/мин.",
    description: "Загрузка 8 кг, Отжим 1400 об/мин. Продаётся в Ташкенте.",
    priceUzs: 6_533_000,
    oldPriceUzs: null,
    sku: "00030045",
    stockQuantity: 5,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-haier-hw80-b14279s",
        url: "/products/haier-hw80-b14279s.webp",
        alt: "Стиральная машина Haier HW80-B14279S",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "haier-hw80-b14279s-1",
        name: "Загрузка",
        value: "8",
        unit: "кг",
        sortOrder: 1,
      },
      {
        id: "haier-hw80-b14279s-2",
        name: "Отжим",
        value: "1400",
        unit: "об/мин",
        sortOrder: 2,
      },
      {
        id: "haier-hw80-b14279s-3",
        name: "Количество программ",
        value: "14",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-359571",
    categoryId: "cat-washer",
    brand: "Premier",
    name: "Стиральная машина Premier PRM70F1210SIN/G",
    slug: "premier-prm70f1210sin-g",
    shortDescription: "Загрузка 7 кг, Отжим 1200 об/мин.",
    description: "Загрузка 7 кг, Отжим 1200 об/мин. Продаётся в Ташкенте.",
    priceUzs: 4_499_000,
    oldPriceUzs: null,
    sku: "00032500",
    stockQuantity: 24,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-premier-prm70f1210sin-g",
        url: "/products/premier-prm70f1210sin-g.png",
        alt: "Стиральная машина Premier PRM70F1210SIN/G",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "premier-prm70f1210sin-g-1",
        name: "Загрузка",
        value: "7",
        unit: "кг",
        sortOrder: 1,
      },
      {
        id: "premier-prm70f1210sin-g-2",
        name: "Отжим",
        value: "1200",
        unit: "об/мин",
        sortOrder: 2,
      },
      {
        id: "premier-prm70f1210sin-g-3",
        name: "Количество программ",
        value: "15",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-89507",
    categoryId: "cat-washer",
    brand: "LG",
    name: "Стиральная машина LG F4V5VG2S",
    slug: "lg-f4v5vg2s",
    shortDescription: "Загрузка 9 кг, Отжим 1400 об/мин.",
    description: "Загрузка 9 кг, Отжим 1400 об/мин. Продаётся в Ташкенте.",
    priceUzs: 8_999_000,
    oldPriceUzs: null,
    sku: "00002872",
    stockQuantity: 8,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-f4v5vg2s",
        url: "/products/lg-f4v5vg2s.jpg",
        alt: "Стиральная машина LG F4V5VG2S",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-f4v5vg2s-1",
        name: "Загрузка",
        value: "9",
        unit: "кг",
        sortOrder: 1,
      },
      {
        id: "lg-f4v5vg2s-2",
        name: "Отжим",
        value: "1400",
        unit: "об/мин",
        sortOrder: 2,
      },
      {
        id: "lg-f4v5vg2s-3",
        name: "Тип стиральной машины",
        value: "С сушкой",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-356271",
    categoryId: "cat-washer",
    brand: "Hisense",
    name: "Стиральная машина Hisense WFQP7012EVM",
    slug: "hisense-wfqp7012evm",
    shortDescription: "Загрузка 7 кг, Отжим 1200 об/мин.",
    description: "Загрузка 7 кг, Отжим 1200 об/мин. Продаётся в Ташкенте.",
    priceUzs: 3_494_000,
    oldPriceUzs: null,
    sku: "00028469",
    stockQuantity: 2,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-hisense-wfqp7012evm",
        url: "/products/hisense-wfqp7012evm.webp",
        alt: "Стиральная машина Hisense WFQP7012EVM",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "hisense-wfqp7012evm-1",
        name: "Загрузка",
        value: "7",
        unit: "кг",
        sortOrder: 1,
      },
      {
        id: "hisense-wfqp7012evm-2",
        name: "Отжим",
        value: "1200",
        unit: "об/мин",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-91536",
    categoryId: "cat-vacuum",
    brand: "LG",
    name: "Пылесос LG VK69662N",
    slug: "lg-vk69662n",
    shortDescription: "Пылесборник Контейнер, Мощность всасывания 350 Вт.",
    description: "Пылесборник Контейнер, Мощность всасывания 350 Вт. Продаётся в Ташкенте.",
    priceUzs: 1_299_000,
    oldPriceUzs: null,
    sku: "00004642",
    stockQuantity: 24,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-vk69662n",
        url: "/products/lg-vk69662n.webp",
        alt: "Пылесос LG VK69662N",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-vk69662n-1",
        name: "Пылесборник",
        value: "Контейнер",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "lg-vk69662n-2",
        name: "Мощность всасывания",
        value: "350",
        unit: "Вт",
        sortOrder: 2,
      },
      {
        id: "lg-vk69662n-3",
        name: "Потребляемая мощность",
        value: "1600",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-87817",
    categoryId: "cat-vacuum",
    brand: "Philips",
    name: "Пылесос Philips FC9573/01",
    slug: "philips-fc9573-01",
    shortDescription: "Пылесборник Контейнер, Мощность всасывания 400 Вт.",
    description: "Пылесборник Контейнер, Мощность всасывания 400 Вт. Продаётся в Ташкенте.",
    priceUzs: 3_269_000,
    oldPriceUzs: null,
    sku: "00002143",
    stockQuantity: 27,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-philips-fc9573-01",
        url: "/products/philips-fc9573-01.webp",
        alt: "Пылесос Philips FC9573/01",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "philips-fc9573-01-1",
        name: "Пылесборник",
        value: "Контейнер",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "philips-fc9573-01-2",
        name: "Мощность всасывания",
        value: "400",
        unit: "Вт",
        sortOrder: 2,
      },
      {
        id: "philips-fc9573-01-3",
        name: "Уборка",
        value: "Сухая",
        unit: "",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-91565",
    categoryId: "cat-vacuum",
    brand: "Samsung",
    name: "Пылесос Samsung VC15K4176HG/EV",
    slug: "samsung-vc15k4176hg-ev",
    shortDescription: "Пылесборник Контейнер, Мощность всасывания 390 Вт.",
    description: "Пылесборник Контейнер, Мощность всасывания 390 Вт. Продаётся в Ташкенте.",
    priceUzs: 1_710_000,
    oldPriceUzs: null,
    sku: "00009900",
    stockQuantity: 1,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-vc15k4176hg-ev",
        url: "/products/samsung-vc15k4176hg-ev.jpg",
        alt: "Пылесос Samsung VC15K4176HG/EV",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-vc15k4176hg-ev-1",
        name: "Пылесборник",
        value: "Контейнер",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "samsung-vc15k4176hg-ev-2",
        name: "Мощность всасывания",
        value: "390",
        unit: "Вт",
        sortOrder: 2,
      },
      {
        id: "samsung-vc15k4176hg-ev-3",
        name: "Потребляемая мощность",
        value: "1500",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-357704",
    categoryId: "cat-vacuum",
    brand: "Tefal",
    name: "Пылесос Tefal TW7B33EA",
    slug: "tefal-tw7b33ea",
    shortDescription: "Пылесборник Контейнер, Мощность всасывания 900 Вт.",
    description: "Пылесборник Контейнер, Мощность всасывания 900 Вт. Продаётся в Ташкенте.",
    priceUzs: 3_299_000,
    oldPriceUzs: null,
    sku: "00030042",
    stockQuantity: 7,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-tefal-tw7b33ea",
        url: "/products/tefal-tw7b33ea.webp",
        alt: "Пылесос Tefal TW7B33EA",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "tefal-tw7b33ea-1",
        name: "Пылесборник",
        value: "Контейнер",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "tefal-tw7b33ea-2",
        name: "Мощность всасывания",
        value: "900",
        unit: "Вт",
        sortOrder: 2,
      },
      {
        id: "tefal-tw7b33ea-3",
        name: "Потребляемая мощность",
        value: "750",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-356860",
    categoryId: "cat-vacuum",
    brand: "Samsung",
    name: "Пылесос Samsung VCC8824H35/UZ",
    slug: "samsung-vcc8824h35-uz",
    shortDescription: "Пылесборник Контейнер, Мощность всасывания 390 Вт.",
    description: "Пылесборник Контейнер, Мощность всасывания 390 Вт. Продаётся в Ташкенте.",
    priceUzs: 2_199_000,
    oldPriceUzs: null,
    sku: "00029223",
    stockQuantity: 17,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-vcc8824h35-uz",
        url: "/products/samsung-vcc8824h35-uz.webp",
        alt: "Пылесос Samsung VCC8824H35/UZ",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-vcc8824h35-uz-1",
        name: "Пылесборник",
        value: "Контейнер",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "samsung-vcc8824h35-uz-2",
        name: "Мощность всасывания",
        value: "390",
        unit: "Вт",
        sortOrder: 2,
      },
      {
        id: "samsung-vcc8824h35-uz-3",
        name: "Потребляемая мощность",
        value: "1800",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-357474",
    categoryId: "cat-vacuum",
    brand: "Dreame",
    name: "Беспроводной пылесос Dreame Trouver K10 Pro",
    slug: "dreame-trouver-k10-pro",
    shortDescription: "Мощность всасывания 80 Вт, Время зарядки аккумулятора 270 мин.",
    description: "Мощность всасывания 80 Вт, Время зарядки аккумулятора 270 мин. Продаётся в Ташкенте.",
    priceUzs: 4_499_000,
    oldPriceUzs: null,
    sku: "00029896",
    stockQuantity: 2,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-dreame-trouver-k10-pro",
        url: "/products/dreame-trouver-k10-pro.webp",
        alt: "Беспроводной пылесос Dreame Trouver K10 Pro",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "dreame-trouver-k10-pro-1",
        name: "Мощность всасывания",
        value: "80",
        unit: "Вт",
        sortOrder: 1,
      },
      {
        id: "dreame-trouver-k10-pro-2",
        name: "Время зарядки аккумулятора",
        value: "270",
        unit: "мин",
        sortOrder: 2,
      },
      {
        id: "dreame-trouver-k10-pro-3",
        name: "Время работы от аккумулятора",
        value: "30",
        unit: "мин",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-100856",
    categoryId: "cat-ac",
    brand: "Artel",
    name: "Кондиционер Artel 12HS S SIR1W12BE",
    slug: "artel-12hs-s-sir1w12be",
    shortDescription: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1096/1141 Вт.",
    description: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1096/1141 Вт. Продаётся в Ташкенте.",
    priceUzs: 4_893_000,
    oldPriceUzs: null,
    sku: "00023046",
    stockQuantity: 1,
    isActive: true,
    isFeatured: true,
    images: [
      {
        id: "img-artel-12hs-s-sir1w12be",
        url: "/products/artel-12hs-s-sir1w12be.webp",
        alt: "Кондиционер Artel 12HS S SIR1W12BE",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "artel-12hs-s-sir1w12be-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "artel-12hs-s-sir1w12be-2",
        name: "Потребляемая мощность (обогрев/охлаждение)",
        value: "1096/1141 Вт",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "artel-12hs-s-sir1w12be-3",
        name: "Мощность охлаждения",
        value: "3500",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-80619",
    categoryId: "cat-ac",
    brand: "Avalon",
    name: "Кондиционер Avalon ART 12HQ",
    slug: "avalon-art-12hq",
    shortDescription: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1200/955 Вт.",
    description: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1200/955 Вт. Продаётся в Ташкенте.",
    priceUzs: 7_298_000,
    oldPriceUzs: null,
    sku: "00000160",
    stockQuantity: 7,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-avalon-art-12hq",
        url: "/products/avalon-art-12hq.webp",
        alt: "Кондиционер Avalon ART 12HQ",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "avalon-art-12hq-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "avalon-art-12hq-2",
        name: "Потребляемая мощность (обогрев/охлаждение)",
        value: "1200/955 Вт",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "avalon-art-12hq-3",
        name: "Мощность охлаждения",
        value: "3600",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-80569",
    categoryId: "cat-ac",
    brand: "LG",
    name: "Кондиционер LG B12TS",
    slug: "lg-b12ts",
    shortDescription: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1550/1400 Вт.",
    description: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1550/1400 Вт. Продаётся в Ташкенте.",
    priceUzs: 6_999_000,
    oldPriceUzs: null,
    sku: "00008686",
    stockQuantity: 39,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-b12ts",
        url: "/products/lg-b12ts.webp",
        alt: "Кондиционер LG B12TS",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-b12ts-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "lg-b12ts-2",
        name: "Потребляемая мощность (обогрев/охлаждение)",
        value: "1550/1400 Вт",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "lg-b12ts-3",
        name: "Мощность охлаждения",
        value: "3870",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-357452",
    categoryId: "cat-ac",
    brand: "Hisense",
    name: "Кондиционер Hisense AST-12UW4SVETD15",
    slug: "hisense-ast-12uw4svetd15",
    shortDescription: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1025/1060 Вт.",
    description: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1025/1060 Вт. Продаётся в Ташкенте.",
    priceUzs: 5_699_000,
    oldPriceUzs: null,
    sku: "00028976",
    stockQuantity: 37,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-hisense-ast-12uw4svetd15",
        url: "/products/hisense-ast-12uw4svetd15.webp",
        alt: "Кондиционер Hisense AST-12UW4SVETD15",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "hisense-ast-12uw4svetd15-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "hisense-ast-12uw4svetd15-2",
        name: "Потребляемая мощность (обогрев/охлаждение)",
        value: "1025/1060 Вт",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "hisense-ast-12uw4svetd15-3",
        name: "Мощность охлаждения",
        value: "3500",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-358624",
    categoryId: "cat-ac",
    brand: "Haier",
    name: "Кондиционер Haier AS35RF1HRA",
    slug: "haier-as35rf1hra",
    shortDescription: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1025/1060 Вт.",
    description: "Инвертор Есть, Потребляемая мощность (обогрев/охлаждение) 1025/1060 Вт. Продаётся в Ташкенте.",
    priceUzs: 6_490_000,
    oldPriceUzs: null,
    sku: "00031024",
    stockQuantity: 6,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-haier-as35rf1hra",
        url: "/products/haier-as35rf1hra.webp",
        alt: "Кондиционер Haier AS35RF1HRA",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "haier-as35rf1hra-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "haier-as35rf1hra-2",
        name: "Потребляемая мощность (обогрев/охлаждение)",
        value: "1025/1060 Вт",
        unit: "",
        sortOrder: 2,
      },
      {
        id: "haier-as35rf1hra-3",
        name: "Мощность охлаждения",
        value: "3500",
        unit: "Вт",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "prd-357195",
    categoryId: "cat-ac",
    brand: "Premier",
    name: "Кондиционер Premier PRMZN-12DNA5F (Zomin Inverter)",
    slug: "premier-prmzn-12dna5f-zomin-inverter",
    shortDescription: "Площадь 31-40 кв.м, Инвертор Есть.",
    description: "Площадь 31-40 кв.м, Инвертор Есть. Продаётся в Ташкенте.",
    priceUzs: 6_372_000,
    oldPriceUzs: null,
    sku: "00029642",
    stockQuantity: 2,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-premier-prmzn-12dna5f-zomin-inverter",
        url: "/products/premier-prmzn-12dna5f-zomin-inverter.webp",
        alt: "Кондиционер Premier PRMZN-12DNA5F (Zomin Inverter)",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "premier-prmzn-12dna5f-zomin-inverter-1",
        name: "Площадь",
        value: "31-40 кв.м",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "premier-prmzn-12dna5f-zomin-inverter-2",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-89444",
    categoryId: "cat-kitchen",
    brand: "Polaris",
    name: "Электрочайник Polaris PWK 1759CGL",
    slug: "polaris-pwk-1759cgl",
    shortDescription: "Объём 1,5 л.",
    description: "Объём 1,5 л. Продаётся в Ташкенте.",
    priceUzs: 449_000,
    oldPriceUzs: null,
    sku: "00002812",
    stockQuantity: 10,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-polaris-pwk-1759cgl",
        url: "/products/polaris-pwk-1759cgl.webp",
        alt: "Электрочайник Polaris PWK 1759CGL",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "polaris-pwk-1759cgl-1",
        name: "Объём",
        value: "1,5",
        unit: "л",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "prd-95626",
    categoryId: "cat-kitchen",
    brand: "Tefal",
    name: "Электрочайник Tefal KO693110",
    slug: "tefal-ko693110",
    shortDescription: "Объём 1,5 л.",
    description: "Объём 1,5 л. Продаётся в Ташкенте.",
    priceUzs: 1_290_000,
    oldPriceUzs: null,
    sku: "00013540",
    stockQuantity: 19,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-tefal-ko693110",
        url: "/products/tefal-ko693110.webp",
        alt: "Электрочайник Tefal KO693110",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "tefal-ko693110-1",
        name: "Объём",
        value: "1,5",
        unit: "л",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "prd-81492",
    categoryId: "cat-kitchen",
    brand: "Artel",
    name: "Термопот Artel ART TE 3 8D",
    slug: "artel-art-te-3-8d",
    shortDescription: "Объём 5 л.",
    description: "Объём 5 л. Продаётся в Ташкенте.",
    priceUzs: 579_000,
    oldPriceUzs: null,
    sku: "00001274",
    stockQuantity: 2,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-artel-art-te-3-8d",
        url: "/products/artel-art-te-3-8d.jpg",
        alt: "Термопот Artel ART TE 3 8D",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "artel-art-te-3-8d-1",
        name: "Объём",
        value: "5",
        unit: "л",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "prd-358893",
    categoryId: "cat-kitchen",
    brand: "Braun",
    name: "Электрочайник Braun WK1500GY",
    slug: "braun-wk1500gy",
    shortDescription: "Объём 1,7 л.",
    description: "Объём 1,7 л. Продаётся в Ташкенте.",
    priceUzs: 689_000,
    oldPriceUzs: null,
    sku: "00031386",
    stockQuantity: 14,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-braun-wk1500gy",
        url: "/products/braun-wk1500gy.webp",
        alt: "Электрочайник Braun WK1500GY",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "braun-wk1500gy-1",
        name: "Объём",
        value: "1,7",
        unit: "л",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "prd-81229",
    categoryId: "cat-kitchen",
    brand: "Samsung",
    name: "Микроволновая печь Samsung ME83KRW-1KBW",
    slug: "samsung-me83krw-1kbw",
    shortDescription: "Мощность 800 Вт, Открывание дверцы Кнопка.",
    description: "Мощность 800 Вт, Открывание дверцы Кнопка. Продаётся в Ташкенте.",
    priceUzs: 1_880_000,
    oldPriceUzs: null,
    sku: "00001226",
    stockQuantity: 17,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-me83krw-1kbw",
        url: "/products/samsung-me83krw-1kbw.webp",
        alt: "Микроволновая печь Samsung ME83KRW-1KBW",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-me83krw-1kbw-1",
        name: "Мощность",
        value: "800",
        unit: "Вт",
        sortOrder: 1,
      },
      {
        id: "samsung-me83krw-1kbw-2",
        name: "Открывание дверцы",
        value: "Кнопка",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-81208",
    categoryId: "cat-kitchen",
    brand: "LG",
    name: "Микроволновая печь LG MS2336GIH",
    slug: "lg-ms2336gih",
    shortDescription: "Инвертор Есть, Мощность 1000 Вт.",
    description: "Инвертор Есть, Мощность 1000 Вт. Продаётся в Ташкенте.",
    priceUzs: 1_568_000,
    oldPriceUzs: null,
    sku: "00006192",
    stockQuantity: 24,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-ms2336gih",
        url: "/products/lg-ms2336gih.webp",
        alt: "Микроволновая печь LG MS2336GIH",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-ms2336gih-1",
        name: "Инвертор",
        value: "Есть",
        unit: "",
        sortOrder: 1,
      },
      {
        id: "lg-ms2336gih-2",
        name: "Мощность",
        value: "1000",
        unit: "Вт",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-87198",
    categoryId: "cat-tv",
    brand: "Artel",
    name: "Телевизор Artel UA43H3502 Smart",
    slug: "artel-ua43h3502-smart",
    shortDescription: "Диагональ 43 дюйм, Smart TV Есть.",
    description: "Диагональ 43 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 3_843_000,
    oldPriceUzs: null,
    sku: "00001773",
    stockQuantity: 4,
    isActive: true,
    isFeatured: true,
    images: [
      {
        id: "img-artel-ua43h3502-smart",
        url: "/products/artel-ua43h3502-smart.webp",
        alt: "Телевизор Artel UA43H3502 Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "artel-ua43h3502-smart-1",
        name: "Диагональ",
        value: "43",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "artel-ua43h3502-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358796",
    categoryId: "cat-tv",
    brand: "Premier",
    name: "Телевизор Premier 32PRM840FSV Smart",
    slug: "premier-32prm840fsv-smart",
    shortDescription: "Диагональ 32 дюйм, Smart TV Есть.",
    description: "Диагональ 32 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 1_794_000,
    oldPriceUzs: null,
    sku: "00031564",
    stockQuantity: 3,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-premier-32prm840fsv-smart",
        url: "/products/premier-32prm840fsv-smart.webp",
        alt: "Телевизор Premier 32PRM840FSV Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "premier-32prm840fsv-smart-1",
        name: "Диагональ",
        value: "32",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "premier-32prm840fsv-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358804",
    categoryId: "cat-tv",
    brand: "LG",
    name: "Телевизор LG 43NANO80A6B Smart",
    slug: "lg-43nano80a6b-smart",
    shortDescription: "Диагональ 43 дюйм, Smart TV Есть.",
    description: "Диагональ 43 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 5_999_000,
    oldPriceUzs: null,
    sku: "00031087",
    stockQuantity: 6,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-lg-43nano80a6b-smart",
        url: "/products/lg-43nano80a6b-smart.webp",
        alt: "Телевизор LG 43NANO80A6B Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "lg-43nano80a6b-smart-1",
        name: "Диагональ",
        value: "43",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "lg-43nano80a6b-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358781",
    categoryId: "cat-tv",
    brand: "Samsung",
    name: "Телевизор Samsung QE43Q7FAA Smart",
    slug: "samsung-qe43q7faa-smart",
    shortDescription: "Диагональ 43 дюйм, Smart TV Есть.",
    description: "Диагональ 43 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 5_652_000,
    oldPriceUzs: null,
    sku: "00031353",
    stockQuantity: 24,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-qe43q7faa-smart",
        url: "/products/samsung-qe43q7faa-smart.webp",
        alt: "Телевизор Samsung QE43Q7FAA Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-qe43q7faa-smart-1",
        name: "Диагональ",
        value: "43",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "samsung-qe43q7faa-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358390",
    categoryId: "cat-tv",
    brand: "Haier",
    name: "Телевизор Haier H55K801UG Smart",
    slug: "haier-h55k801ug-smart",
    shortDescription: "Диагональ 55 дюйм, Smart TV Есть.",
    description: "Диагональ 55 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 5_622_000,
    oldPriceUzs: null,
    sku: "00030570",
    stockQuantity: 19,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-haier-h55k801ug-smart",
        url: "/products/haier-h55k801ug-smart.webp",
        alt: "Телевизор Haier H55K801UG Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "haier-h55k801ug-smart-1",
        name: "Диагональ",
        value: "55",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "haier-h55k801ug-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "prd-358939",
    categoryId: "cat-tv",
    brand: "Samsung",
    name: "Телевизор Samsung QE55Q8FAA Smart",
    slug: "samsung-qe55q8faa-smart",
    shortDescription: "Диагональ 55 дюйм, Smart TV Есть.",
    description: "Диагональ 55 дюйм, Smart TV Есть. Продаётся в Ташкенте.",
    priceUzs: 13_159_000,
    oldPriceUzs: null,
    sku: "00031359",
    stockQuantity: 13,
    isActive: true,
    isFeatured: false,
    images: [
      {
        id: "img-samsung-qe55q8faa-smart",
        url: "/products/samsung-qe55q8faa-smart.webp",
        alt: "Телевизор Samsung QE55Q8FAA Smart",
        sortOrder: 1,
      },
    ],
    attributes: [
      {
        id: "samsung-qe55q8faa-smart-1",
        name: "Диагональ",
        value: "55",
        unit: "дюйм",
        sortOrder: 1,
      },
      {
        id: "samsung-qe55q8faa-smart-2",
        name: "Smart TV",
        value: "Есть",
        unit: "",
        sortOrder: 2,
      },
    ],
  },
]

export function formatUzs(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} сум`
}

export function countLabel(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? "товар"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "товара"
        : "товаров"
  return `${count} ${word}`
}

export const compareLimit = 4
export const pageSize = 12

export type SortKey = "featured" | "price-asc" | "price-desc" | "new"

export function categoryBySlug(slug: string, source: Category[] = categories) {
  return source.find((category) => category.slug === slug && category.isActive)
}

export function productBySlug(slug: string, source: Product[] = products) {
  return source.find((product) => product.slug === slug && product.isActive)
}

export function categoryById(id: string, source: Category[] = categories) {
  return source.find((category) => category.id === id)
}

export type CatalogQuery = {
  q?: string
  category?: string
  brand?: string
  min?: number
  max?: number
  inStock?: boolean
  attr?: string
  sort?: SortKey
  page?: number
}

function matchesQuery(product: Product, query: string) {
  if (!query) return true
  return [product.name, product.brand, product.sku].some((value) =>
    value.toLowerCase().includes(query),
  )
}

function matchesAttr(product: Product, attr: string) {
  const [name, value, unit = ""] = attr.split("|")
  if (!name || !value) return true
  return product.attributes.some(
    (item) => item.name === name && item.value === value && item.unit === unit,
  )
}

export function queryCatalog(
  input: CatalogQuery,
  source: Product[] = products,
  categorySource: Category[] = categories,
) {
  const query = input.q?.trim().toLowerCase() ?? ""
  const category = input.category ? categoryBySlug(input.category, categorySource) : undefined
  const sort = input.sort ?? "featured"
  const filtered = source
    .filter((product) => product.isActive)
    .filter((product) => (category ? product.categoryId === category.id : true))
    .filter((product) => (input.brand ? product.brand === input.brand : true))
    .filter((product) =>
      input.min !== undefined && !Number.isNaN(input.min) ? product.priceUzs >= input.min : true,
    )
    .filter((product) =>
      input.max !== undefined && !Number.isNaN(input.max) ? product.priceUzs <= input.max : true,
    )
    .filter((product) => (input.inStock ? product.stockQuantity > 0 : true))
    .filter((product) => (input.attr ? matchesAttr(product, input.attr) : true))
    .filter((product) => matchesQuery(product, query))

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.priceUzs - b.priceUzs
    if (sort === "price-desc") return b.priceUzs - a.priceUzs
    if (sort === "new") return source.indexOf(b) - source.indexOf(a)
    return Number(b.isFeatured) - Number(a.isFeatured)
  })

  const page = Math.max(1, input.page ?? 1)
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pages)
  const start = (current - 1) * pageSize

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page: current,
    pages,
  }
}

export function brandsFor(
  categorySlug?: string,
  source: Product[] = products,
  categorySource: Category[] = categories,
) {
  const category = categorySlug ? categoryBySlug(categorySlug, categorySource) : undefined
  const names = source
    .filter((product) => product.isActive)
    .filter((product) => (category ? product.categoryId === category.id : true))
    .map((product) => product.brand)
  return [...new Set(names)]
}

export function attributeChoices(
  categorySlug?: string,
  source: Product[] = products,
  categorySource: Category[] = categories,
) {
  const category = categorySlug ? categoryBySlug(categorySlug, categorySource) : undefined
  if (!category) return []
  const map = new Map<string, { name: string; value: string; unit: string }>()
  for (const product of source) {
    if (product.categoryId !== category.id || !product.isActive) continue
    for (const attribute of product.attributes) {
      const key = `${attribute.name}|${attribute.value}|${attribute.unit}`
      map.set(key, attribute)
    }
  }
  return [...map.values()]
}

export function similarProducts(product: Product, source: Product[] = products) {
  return source.filter(
    (item) =>
      item.isActive && item.categoryId === product.categoryId && item.id !== product.id,
  )
}
