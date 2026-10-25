import imgBrakes from "../assets/parts/brakes.svg"
import imgFilter from "../assets/parts/filter.svg"
import imgSparkplug from "../assets/parts/sparkplug.svg"
import imgEngine from "../assets/parts/engine.svg"
import imgSuspension from "../assets/parts/suspension.svg"
import imgElectrical from "../assets/parts/electrical.svg"
import imgBattery from "../assets/parts/battery.svg"
import imgOil from "../assets/parts/oil.svg"
import imgTransmission from "../assets/parts/transmission.svg"
import imgHeavyDuty from "../assets/parts/heavy-duty.svg"
import imgAccessories from "../assets/parts/accessories.svg"

export type ProductStatus = "NEW" | "SALE" | "POPULAR" | "LOW_STOCK" | "OUT_OF_STOCK" | "ACTIVE"
export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Shipped" | "Delivered" | "Cancelled"
export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  code: string
  partNumber: string
  price: number
  salePrice?: number
  stock: number
  minStock: number
  compatibility: string[]
  description: string
  specs: Record<string, string>
  warranty: string
  status: ProductStatus
  image: string
  images: string[]
  active: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
  count: number
  active?: boolean
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  orders: number
  totalPurchases: number
  registeredAt: string
  status: "active" | "inactive"
}

export interface OrderItem {
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  image: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  date: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  paymentMethod: string
  deliveryMethod: string
  status: OrderStatus
  address: string
}

export const categories: Category[] = [
  {
    id: "engine",
    name: "Motor",
    description: "Pistones, empaques, fajas de tiempo y conjuntos completos",
    icon: "⚙️",
    image: imgEngine,
    count: 342,
  },
  {
    id: "brakes",
    name: "Frenos",
    description: "Pastillas, discos, mordazas y sistemas de líquido de frenos",
    icon: "🔴",
    image: imgBrakes,
    count: 218,
  },
  {
    id: "suspension",
    name: "Suspensión",
    description: "Amortiguadores, resortes, terminales y bujes",
    icon: "🔩",
    image: imgSuspension,
    count: 189,
  },
  {
    id: "transmission",
    name: "Transmisión",
    description:
      "Kits de embrague, piezas de caja y componentes de diferencial",
    icon: "⚙️",
    image: imgTransmission,
    count: 156,
  },
  {
    id: "electrical",
    name: "Sistema eléctrico",
    description: "Alternadores, arranques, sensores y sistemas de iluminación",
    icon: "⚡",
    image: imgElectrical,
    count: 274,
  },
  {
    id: "filters",
    name: "Filtros",
    description:
      "Filtros de aceite, aire, combustible y cabina para todo vehículo",
    icon: "🔧",
    image: imgFilter,
    count: 421,
  },
  {
    id: "lubricants",
    name: "Lubricantes",
    description: "Aceite de motor, fluido de transmisión, grasa y aditivos",
    icon: "🛢️",
    image: imgOil,
    count: 98,
  },
  {
    id: "accessories",
    name: "Accesorios",
    description: "Herramientas, accesorios de remolque y cuidado del vehículo",
    icon: "🔑",
    image: imgAccessories,
    count: 203,
  },
  {
    id: "heavy-duty",
    name: "Repuestos para pesados",
    description:
      "Componentes especializados para camiones y vehículos comerciales",
    icon: "🚛",
    image: imgHeavyDuty,
    count: 312,
  },
]

// Imágenes locales (SVG) empaquetadas por Vite. Son ilustraciones
// automotrices coherentes con la marca que SIEMPRE cargan (no dependen de
// internet ni de terceros), eliminando las imágenes rotas o mal asociadas.
// El handler `imgFallback` (src/lib/images.ts) sigue disponible como red de
// seguridad para cualquier <img> que apunte a una URL remota.
const productImages = {
  brakepad: imgBrakes, // Pastillas / discos de freno
  oilfilter: imgFilter, // Filtro de aceite
  sparkplug: imgSparkplug, // Bujías / candelas
  engine: imgEngine, // Motor
  shockabs: imgSuspension, // Amortiguador / suspensión
  battery: imgBattery, // Batería
  motoroil: imgOil, // Aceite de motor
  airfilter: imgFilter, // Filtro de aire
  clutch: imgTransmission, // Kit de embrague / transmisión
  alternator: imgElectrical, // Alternador / sistema eléctrico
  heavyduty: imgHeavyDuty, // Repuestos para vehículos pesados
}

export const products: Product[] = [
  {
    id: "P001",
    name: "Juego de pastillas de freno cerámicas premium",
    brand: "Bosch",
    category: "brakes",
    code: "SG-BP-0234",
    partNumber: "BP-TYO-2345-F",
    price: 89.99,
    salePrice: 74.99,
    stock: 48,
    minStock: 10,
    compatibility: [
      "Toyota Hilux 2015-2023",
      "Toyota 4Runner 2012-2022",
      "Lexus GX460 2010-2023",
    ],
    description:
      "Pastillas de freno cerámicas de alto rendimiento con excelente capacidad de frenado, menos polvo y operación casi silenciosa. Diseñadas para condiciones exigentes.",
    specs: {
      Material: "Compuesto cerámico",
      Posición: "Delantera",
      Grosor: "13.2 mm",
      Ancho: "142 mm",
      Altura: "55 mm",
    },
    warranty: "18 meses / 30,000 km",
    status: "SALE",
    image: productImages.brakepad,
    images: [
      productImages.brakepad,
      productImages.engine,
      productImages.sparkplug,
    ],
    active: true,
  },
  {
    id: "P002",
    name: "Filtro de aceite de motor para trabajo pesado",
    brand: "Mann-Filter",
    category: "filters",
    code: "SG-OF-1122",
    partNumber: "W719/45",
    price: 24.5,
    stock: 120,
    minStock: 20,
    compatibility: [
      "Volkswagen Golf 2012-2022",
      "Audi A4 2013-2022",
      "Skoda Octavia 2014-2021",
    ],
    description:
      "Filtro de aceite premium con válvula antidrenaje que asegura una presión óptima al arrancar. Su alta eficiencia retiene partículas de hasta 20 micrones.",
    specs: {
      Rosca: "M20x1.5",
      Altura: "93mm",
      Diámetro: "76mm",
      "Presión de derivación": "1.2 bar",
    },
    warranty: "Durante el intervalo de servicio del aceite",
    status: "POPULAR",
    image: productImages.oilfilter,
    images: [productImages.oilfilter, productImages.airfilter],
    active: true,
  },
  {
    id: "P003",
    name: "Juego de 4 candelas de iridio de larga duración",
    brand: "NGK",
    category: "engine",
    code: "SG-SP-0088",
    partNumber: "ILFR6A11",
    price: 68.0,
    stock: 85,
    minStock: 15,
    compatibility: [
      "Honda Civic 2016-2021",
      "Honda CR-V 2017-2022",
      "Honda Accord 2018-2023",
    ],
    description:
      "Electrodo central de iridio para un encendido óptimo y electrodo de masa de platino que prolonga su vida útil. Juego de 4 candelas.",
    specs: {
      Material: "Iridio/platino",
      Separación: "1.1 mm",
      Rosca: "M14x1.25",
      Alcance: "26.5 mm",
      "Rango térmico": "6",
    },
    warranty: "4 años / 100,000 km",
    status: "NEW",
    image: productImages.sparkplug,
    images: [productImages.sparkplug, productImages.engine],
    active: true,
  },
  {
    id: "P004",
    name: "Amortiguador delantero para trabajo pesado",
    brand: "KYB",
    category: "suspension",
    code: "SG-SA-0456",
    partNumber: "KYB-343316",
    price: 145.0,
    salePrice: 129.0,
    stock: 6,
    minStock: 8,
    compatibility: [
      "Ford F-150 2015-2020",
      "Ford Ranger 2012-2022",
      "Chevrolet Silverado 2014-2019",
    ],
    description:
      "Amortiguador monotubo presurizado para pickups. Mejora el manejo en terrenos irregulares y con cargas pesadas. Reemplazo directo tipo OEM.",
    specs: {
      Tipo: "Monotubo a gas",
      "Longitud extendida": "562 mm",
      "Longitud comprimida": "355 mm",
      Posición: "Delantero izquierdo/derecho",
    },
    warranty: "12 meses / kilometraje ilimitado",
    status: "LOW_STOCK",
    image: productImages.shockabs,
    images: [productImages.shockabs, productImages.engine],
    active: true,
  },
  {
    id: "P005",
    name: "Alternador remanufacturado de 120 A",
    brand: "Valeo",
    category: "electrical",
    code: "SG-AL-0789",
    partNumber: "VAL-439536",
    price: 210.0,
    stock: 22,
    minStock: 5,
    compatibility: [
      "Renault Logan 2010-2020",
      "Renault Sandero 2012-2021",
      "Dacia Duster 2010-2019",
    ],
    description:
      "Remanufacturado según especificaciones OEM. Todos los componentes fueron inspeccionados y reemplazados según necesidad. Incluye escobillas, cojinetes y diodos nuevos.",
    specs: {
      Salida: "120A / 14V",
      "Tipo de polea": "Decoupler",
      Conexión: "B+, D+, W",
      Rotación: "Horario",
    },
    warranty: "24 meses / kilometraje ilimitado",
    status: "ACTIVE",
    image: productImages.alternator,
    images: [productImages.alternator, productImages.engine],
    active: true,
  },
  {
    id: "P006",
    name: "Aceite de motor sintético SAE 5W-30 de 5 L",
    brand: "Castrol EDGE",
    category: "lubricants",
    code: "SG-MO-2210",
    partNumber: "CAS-5W30-5L",
    price: 55.0,
    salePrice: 48.99,
    stock: 200,
    minStock: 50,
    compatibility: [
      "Universal para motores gasolina y diésel que requieren 5W-30",
    ],
    description:
      "Castrol EDGE con tecnología Fluid TITANIUM se adapta bajo presión para reducir la fricción y brindar el máximo rendimiento al motor.",
    specs: {
      Viscosidad: "5W-30",
      Tipo: "Sintético completo",
      Volumen: "5 litros",
      ACEA: "C3",
      API: "SN Plus",
    },
    warranty: "No aplica — consumible",
    status: "POPULAR",
    image: productImages.motoroil,
    images: [productImages.motoroil],
    active: true,
  },
  {
    id: "P007",
    name: "Kit de embrague de 3 piezas",
    brand: "LUK",
    category: "transmission",
    code: "SG-CK-3301",
    partNumber: "LUK-623341600",
    price: 320.0,
    stock: 14,
    minStock: 3,
    compatibility: ["Mitsubishi L200 2005-2015", "Mitsubishi Pajero 2000-2014"],
    description:
      "Kit completo de embrague con disco, plato de presión y cojinete de empuje. Fabricado según especificaciones originales para un acople suave y larga duración.",
    specs: {
      Diámetro: "240mm",
      Estrías: "26",
      "Diámetro de estrías": "24mm",
      "Tipo de resorte": "Resorte helicoidal",
    },
    warranty: "18 meses / 40,000 km",
    status: "ACTIVE",
    image: productImages.clutch,
    images: [productImages.clutch, productImages.engine],
    active: true,
  },
  {
    id: "P008",
    name: "Filtro de aire de alto rendimiento",
    brand: "K&N",
    category: "filters",
    code: "SG-AF-0077",
    partNumber: "KN-33-2423",
    price: 78.0,
    stock: 0,
    minStock: 5,
    compatibility: [
      "Nissan Navara D40 2005-2014",
      "Nissan Pathfinder R51 2005-2012",
    ],
    description:
      "Filtro de aire lavable y reutilizable de alto flujo. Mejora la respuesta del motor y ofrece una filtración sobresaliente.",
    specs: { Forma: "Panel", Largo: "315mm", Ancho: "218mm", Altura: "31mm" },
    warranty: "De por vida (lavable)",
    status: "OUT_OF_STOCK",
    image: productImages.airfilter,
    images: [productImages.airfilter],
    active: true,
  },
  {
    id: "P009",
    name: "Kit de freno de disco para camión, eje delantero",
    brand: "Bendix",
    category: "heavy-duty",
    code: "SG-HB-0012",
    partNumber: "BX-DB-FAXLE-001",
    price: 580.0,
    salePrice: 520.0,
    stock: 8,
    minStock: 2,
    compatibility: [
      "Volvo FH16 2012-2022",
      "Mercedes Actros 2013-2023",
      "Scania R500 2014-2022",
    ],
    description:
      "Kit de frenos de calidad OEM para camiones comerciales pesados. Incluye dos discos y juegos de pastillas para el eje delantero, con máxima disipación de calor.",
    specs: {
      "Diámetro del disco": "430mm",
      "Grosor del disco": "45mm",
      "Material de pastilla": "Semimetálico",
      "Carga por eje": "Hasta 13,000 kg",
    },
    warranty: "12 meses / 200,000 km",
    status: "NEW",
    image: productImages.brakepad,
    images: [productImages.brakepad, productImages.engine],
    active: true,
  },
  {
    id: "P010",
    name: "Kit completo de faja de tiempo",
    brand: "Gates",
    category: "engine",
    code: "SG-TB-4490",
    partNumber: "GATES-K015606XS",
    price: 195.0,
    stock: 30,
    minStock: 5,
    compatibility: [
      "Hyundai Tucson 2.0 2010-2015",
      "Kia Sportage 2.0 2010-2015",
    ],
    description:
      "Kit completo con faja de tiempo, tensor, polea guía y bomba de agua. El reemplazo conjunto asegura componentes nuevos y compatibles.",
    specs: {
      "Longitud de faja": "141T / 1410mm",
      "Ancho de faja": "25.4mm",
      Incluye: "Faja, tensor, polea guía y bomba de agua",
      Material: "Caucho EPDM",
    },
    warranty: "2 años / 60,000 km",
    status: "POPULAR",
    image: productImages.engine,
    images: [productImages.engine, productImages.sparkplug],
    active: true,
  },
  {
    id: "P011",
    name: "Batería 12 V 70 Ah 640 A libre de mantenimiento",
    brand: "Varta",
    category: "electrical",
    code: "SG-BA-0070",
    partNumber: "VAR-570144064",
    price: 129.0,
    stock: 35,
    minStock: 8,
    compatibility: [
      "Universal para vehículos que requieren batería de 70 Ah formato LB3",
    ],
    description:
      "Batería de plomo-ácido libre de mantenimiento con tecnología AGM. Excelente rendimiento en temperaturas extremas y arranque confiable.",
    specs: {
      Capacidad: "70 Ah",
      "Amperaje de arranque en frío": "640 A (EN)",
      Voltaje: "12 V",
      Formato: "LB3",
      Polaridad: "Positivo derecho",
    },
    warranty: "24 meses",
    status: "ACTIVE",
    image: productImages.battery,
    images: [productImages.battery, productImages.alternator],
    active: true,
  },
  {
    id: "P012",
    name: "Conjunto de ballesta trasera para trabajo pesado",
    brand: "Monroe",
    category: "heavy-duty",
    code: "SG-LS-0998",
    partNumber: "MON-LS345-R",
    price: 245.0,
    stock: 12,
    minStock: 3,
    compatibility: [
      "Toyota Land Cruiser 70 Series 2007-2022",
      "Toyota Hilux Vigo 2005-2015",
    ],
    description:
      "Conjunto reforzado de ballestas para gran capacidad de carga. El diseño parabólico reduce peso sin perder resistencia. Incluye accesorios de instalación.",
    specs: {
      Hojas: "5",
      "Arco libre": "78mm",
      "Distancia entre apoyos": "1480mm",
      Posición: "Trasera derecha",
      "Capacidad de carga": "Hasta 1,200 kg",
    },
    warranty: "18 meses / kilometraje ilimitado",
    status: "ACTIVE",
    image: productImages.shockabs,
    images: [productImages.shockabs],
    active: true,
  },
]

export const customers: Customer[] = [
  {
    id: "C001",
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+502 7890-1234",
    orders: 14,
    totalPurchases: 3840.5,
    registeredAt: "2024-01-15",
    status: "active",
  },
  {
    id: "C002",
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@email.com",
    phone: "+502 7234-5678",
    orders: 7,
    totalPurchases: 1205.75,
    registeredAt: "2024-03-22",
    status: "active",
  },
  {
    id: "C003",
    firstName: "Roberto",
    lastName: "Flores",
    email: "r.flores@mecanicarobert.com",
    phone: "+502 7456-7890",
    orders: 28,
    totalPurchases: 12450.0,
    registeredAt: "2023-08-10",
    status: "active",
  },
  {
    id: "C004",
    firstName: "María",
    lastName: "López",
    email: "mlopez@email.com",
    phone: "+502 7123-4567",
    orders: 3,
    totalPurchases: 340.2,
    registeredAt: "2024-07-01",
    status: "active",
  },
  {
    id: "C005",
    firstName: "Juan",
    lastName: "Martínez",
    email: "juan.m@transportes.com",
    phone: "+502 7789-0123",
    orders: 42,
    totalPurchases: 28900.0,
    registeredAt: "2023-02-14",
    status: "active",
  },
  {
    id: "C006",
    firstName: "Diana",
    lastName: "Vásquez",
    email: "diana.v@email.com",
    phone: "+502 7345-6789",
    orders: 1,
    totalPurchases: 55.0,
    registeredAt: "2024-09-10",
    status: "inactive",
  },
]

export const orders: Order[] = [
  {
    id: "ORD-2024-0892",
    customerId: "C003",
    customerName: "Roberto Flores",
    date: "2024-09-20",
    status: "Delivered",
    items: [
      {
        productId: "P001",
        productName: "Juego de pastillas de freno cerámicas premium",
        productCode: "SG-BP-0234",
        quantity: 2,
        unitPrice: 74.99,
        image: productImages.brakepad,
      },
      {
        productId: "P006",
        productName: "Aceite de motor sintético SAE 5W-30 de 5 L",
        productCode: "SG-MO-2210",
        quantity: 4,
        unitPrice: 48.99,
        image: productImages.motoroil,
      },
    ],
    subtotal: 345.94,
    discount: 0,
    shipping: 15.0,
    total: 360.94,
    paymentMethod: "Pedido por WhatsApp",
    deliveryMethod: "Entrega a domicilio",
    address: "Zona 10, 12 calle 3-45, Ciudad de Guatemala",
  },
  {
    id: "ORD-2024-0901",
    customerId: "C001",
    customerName: "Carlos Mendoza",
    date: "2024-09-23",
    status: "Shipped",
    items: [
      {
        productId: "P010",
        productName: "Kit completo de faja de tiempo",
        productCode: "SG-TB-4490",
        quantity: 1,
        unitPrice: 195.0,
        image: productImages.engine,
      },
    ],
    subtotal: 195.0,
    discount: 0,
    shipping: 0,
    total: 195.0,
    paymentMethod: "Pedido por WhatsApp",
    deliveryMethod: "Recoger en tienda",
    address: "Recoger en tienda — SIGO Autorepuestos",
  },
  {
    id: "ORD-2024-0915",
    customerId: "C005",
    customerName: "Juan Martínez",
    date: "2024-09-24",
    status: "Confirmed",
    items: [
      {
        productId: "P009",
        productName: "Kit de freno de disco para camión, eje delantero",
        productCode: "SG-HB-0012",
        quantity: 2,
        unitPrice: 520.0,
        image: productImages.brakepad,
      },
      {
        productId: "P012",
        productName: "Conjunto de ballesta trasera para trabajo pesado",
        productCode: "SG-LS-0998",
        quantity: 2,
        unitPrice: 245.0,
        image: productImages.shockabs,
      },
    ],
    subtotal: 1530.0,
    discount: 50.0,
    shipping: 25.0,
    total: 1505.0,
    paymentMethod: "Pedido por WhatsApp",
    deliveryMethod: "Entrega a domicilio",
    address: "Zona 12, Calzada Atanasio Tzul, Ciudad de Guatemala",
  },
  {
    id: "ORD-2024-0922",
    customerId: "C002",
    customerName: "Ana García",
    date: "2024-09-25",
    status: "Pending",
    items: [
      {
        productId: "P003",
        productName: "Juego de 4 candelas de iridio de larga duración",
        productCode: "SG-SP-0088",
        quantity: 1,
        unitPrice: 68.0,
        image: productImages.sparkplug,
      },
      {
        productId: "P002",
        productName: "Filtro de aceite de motor para trabajo pesado",
        productCode: "SG-OF-1122",
        quantity: 2,
        unitPrice: 24.5,
        image: productImages.oilfilter,
      },
    ],
    subtotal: 117.0,
    discount: 0,
    shipping: 10.0,
    total: 127.0,
    paymentMethod: "Solicitud por WhatsApp",
    deliveryMethod: "Entrega a domicilio",
    address: "Zona 1, 6a avenida 8-12, Quetzaltenango",
  },
  {
    id: "ORD-2024-0910",
    customerId: "C005",
    customerName: "Juan Martínez",
    date: "2024-09-22",
    status: "Preparing",
    items: [
      {
        productId: "P007",
        productName: "Kit de embrague de 3 piezas",
        productCode: "SG-CK-3301",
        quantity: 1,
        unitPrice: 320.0,
        image: productImages.clutch,
      },
    ],
    subtotal: 320.0,
    discount: 0,
    shipping: 20.0,
    total: 340.0,
    paymentMethod: "Pedido por WhatsApp",
    deliveryMethod: "Entrega a domicilio",
    address: "Zona 12, Calzada Atanasio Tzul, Ciudad de Guatemala",
  },
]

export const salesData = [
  { month: "Abr", sales: 18400, orders: 142 },
  { month: "May", sales: 22100, orders: 168 },
  { month: "Jun", sales: 19800, orders: 155 },
  { month: "Jul", sales: 24300, orders: 187 },
  { month: "Ago", sales: 28700, orders: 214 },
  { month: "Sep", sales: 31200, orders: 241 },
]

export const categoryData = [
  { name: "Filtros", value: 28 },
  { name: "Motor", value: 22 },
  { name: "Frenos", value: 18 },
  { name: "Pesados", value: 15 },
  { name: "Sistema eléctrico", value: 10 },
  { name: "Otros", value: 7 },
]

export const topProducts = [
  { name: "Pastillas de freno Bosch", sales: 94, revenue: 7049.06 },
  { name: "Aceite Castrol 5 L", sales: 210, revenue: 10287.9 },
  { name: "Candelas NGK x4", sales: 76, revenue: 5168.0 },
  { name: "Filtro de aceite Mann", sales: 188, revenue: 4606.0 },
  { name: "Kit de faja de tiempo", sales: 42, revenue: 8190.0 },
]

export const orderStatusData = [
  { name: "Entregados", value: 412, color: "#4ADE80" },
  { name: "Enviados", value: 68, color: "#2DD4BF" },
  { name: "En preparación", value: 34, color: "#C084FC" },
  { name: "Confirmados", value: 29, color: "#60A5FA" },
  { name: "Pendientes", value: 18, color: "#FFAA00" },
  { name: "Cancelados", value: 12, color: "#F87171" },
]
