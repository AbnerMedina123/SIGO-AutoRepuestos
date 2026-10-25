-- ============================================================================
-- SIGO Autorepuestos — Datos iniciales (seed)
-- ============================================================================
-- Ejecuta este archivo DESPUÉS de schema.sql en el SQL Editor de Supabase.
-- Migra las categorías, productos, clientes y pedidos de ejemplo.
--
-- Nota sobre imágenes: el campo `image`/`images` se deja vacío. La aplicación
-- resuelve una ilustración local por categoría (src/assets/parts/*.svg) cuando
-- el producto no trae imagen, así nunca hay imágenes rotas. Cuando subas fotos
-- reales desde el panel admin, se guardará su URL aquí.
-- ============================================================================

-- --- Categorías --------------------------------------------------------------
insert into public.categories (id, name, description, icon, count) values
  ('engine',       'Motor',                   'Pistones, empaques, fajas de tiempo y conjuntos completos',          '⚙️', 342),
  ('brakes',       'Frenos',                  'Pastillas, discos, mordazas y sistemas de líquido de frenos',        '🔴', 218),
  ('suspension',   'Suspensión',              'Amortiguadores, resortes, terminales y bujes',                        '🔩', 189),
  ('transmission', 'Transmisión',             'Kits de embrague, piezas de caja y componentes de diferencial',       '⚙️', 156),
  ('electrical',   'Sistema eléctrico',       'Alternadores, arranques, sensores y sistemas de iluminación',         '⚡', 274),
  ('filters',      'Filtros',                 'Filtros de aceite, aire, combustible y cabina para todo vehículo',    '🔧', 421),
  ('lubricants',   'Lubricantes',             'Aceite de motor, fluido de transmisión, grasa y aditivos',            '🛢️', 98),
  ('accessories',  'Accesorios',              'Herramientas, accesorios de remolque y cuidado del vehículo',         '🔑', 203),
  ('heavy-duty',   'Repuestos para pesados',  'Componentes especializados para camiones y vehículos comerciales',    '🚛', 312);

-- --- Productos ---------------------------------------------------------------
insert into public.products
  (id, name, brand, category, code, part_number, price, sale_price, stock, min_stock, compatibility, description, specs, warranty, status)
values
  ('P001', 'Juego de pastillas de freno cerámicas premium', 'Bosch', 'brakes', 'SG-BP-0234', 'BP-TYO-2345-F',
   89.99, 74.99, 48, 10,
   array['Toyota Hilux 2015-2023','Toyota 4Runner 2012-2022','Lexus GX460 2010-2023'],
   'Pastillas de freno cerámicas de alto rendimiento con excelente capacidad de frenado, menos polvo y operación casi silenciosa. Diseñadas para condiciones exigentes.',
   '{"Material":"Compuesto cerámico","Posición":"Delantera","Grosor":"13.2 mm","Ancho":"142 mm","Altura":"55 mm"}'::jsonb,
   '18 meses / 30,000 km', 'SALE'),

  ('P002', 'Filtro de aceite de motor para trabajo pesado', 'Mann-Filter', 'filters', 'SG-OF-1122', 'W719/45',
   24.50, null, 120, 20,
   array['Volkswagen Golf 2012-2022','Audi A4 2013-2022','Skoda Octavia 2014-2021'],
   'Filtro de aceite premium con válvula antidrenaje que asegura una presión óptima al arrancar. Su alta eficiencia retiene partículas de hasta 20 micrones.',
   '{"Rosca":"M20x1.5","Altura":"93mm","Diámetro":"76mm","Presión de derivación":"1.2 bar"}'::jsonb,
   'Durante el intervalo de servicio del aceite', 'POPULAR'),

  ('P003', 'Juego de 4 candelas de iridio de larga duración', 'NGK', 'engine', 'SG-SP-0088', 'ILFR6A11',
   68.00, null, 85, 15,
   array['Honda Civic 2016-2021','Honda CR-V 2017-2022','Honda Accord 2018-2023'],
   'Electrodo central de iridio para un encendido óptimo y electrodo de masa de platino que prolonga su vida útil. Juego de 4 candelas.',
   '{"Material":"Iridio/platino","Separación":"1.1 mm","Rosca":"M14x1.25","Alcance":"26.5 mm","Rango térmico":"6"}'::jsonb,
   '4 años / 100,000 km', 'NEW'),

  ('P004', 'Amortiguador delantero para trabajo pesado', 'KYB', 'suspension', 'SG-SA-0456', 'KYB-343316',
   145.00, 129.00, 6, 8,
   array['Ford F-150 2015-2020','Ford Ranger 2012-2022','Chevrolet Silverado 2014-2019'],
   'Amortiguador monotubo presurizado para pickups. Mejora el manejo en terrenos irregulares y con cargas pesadas. Reemplazo directo tipo OEM.',
   '{"Tipo":"Monotubo a gas","Longitud extendida":"562 mm","Longitud comprimida":"355 mm","Posición":"Delantero izquierdo/derecho"}'::jsonb,
   '12 meses / kilometraje ilimitado', 'LOW_STOCK'),

  ('P005', 'Alternador remanufacturado de 120 A', 'Valeo', 'electrical', 'SG-AL-0789', 'VAL-439536',
   210.00, null, 22, 5,
   array['Renault Logan 2010-2020','Renault Sandero 2012-2021','Dacia Duster 2010-2019'],
   'Remanufacturado según especificaciones OEM. Todos los componentes fueron inspeccionados y reemplazados según necesidad. Incluye escobillas, cojinetes y diodos nuevos.',
   '{"Salida":"120A / 14V","Tipo de polea":"Decoupler","Conexión":"B+, D+, W","Rotación":"Horario"}'::jsonb,
   '24 meses / kilometraje ilimitado', 'ACTIVE'),

  ('P006', 'Aceite de motor sintético SAE 5W-30 de 5 L', 'Castrol EDGE', 'lubricants', 'SG-MO-2210', 'CAS-5W30-5L',
   55.00, 48.99, 200, 50,
   array['Universal para motores gasolina y diésel que requieren 5W-30'],
   'Castrol EDGE con tecnología Fluid TITANIUM se adapta bajo presión para reducir la fricción y brindar el máximo rendimiento al motor.',
   '{"Viscosidad":"5W-30","Tipo":"Sintético completo","Volumen":"5 litros","ACEA":"C3","API":"SN Plus"}'::jsonb,
   'No aplica — consumible', 'POPULAR'),

  ('P007', 'Kit de embrague de 3 piezas', 'LUK', 'transmission', 'SG-CK-3301', 'LUK-623341600',
   320.00, null, 14, 3,
   array['Mitsubishi L200 2005-2015','Mitsubishi Pajero 2000-2014'],
   'Kit completo de embrague con disco, plato de presión y cojinete de empuje. Fabricado según especificaciones originales para un acople suave y larga duración.',
   '{"Diámetro":"240mm","Estrías":"26","Diámetro de estrías":"24mm","Tipo de resorte":"Resorte helicoidal"}'::jsonb,
   '18 meses / 40,000 km', 'ACTIVE'),

  ('P008', 'Filtro de aire de alto rendimiento', 'K&N', 'filters', 'SG-AF-0077', 'KN-33-2423',
   78.00, null, 0, 5,
   array['Nissan Navara D40 2005-2014','Nissan Pathfinder R51 2005-2012'],
   'Filtro de aire lavable y reutilizable de alto flujo. Mejora la respuesta del motor y ofrece una filtración sobresaliente.',
   '{"Forma":"Panel","Largo":"315mm","Ancho":"218mm","Altura":"31mm"}'::jsonb,
   'De por vida (lavable)', 'OUT_OF_STOCK'),

  ('P009', 'Kit de freno de disco para camión, eje delantero', 'Bendix', 'heavy-duty', 'SG-HB-0012', 'BX-DB-FAXLE-001',
   580.00, 520.00, 8, 2,
   array['Volvo FH16 2012-2022','Mercedes Actros 2013-2023','Scania R500 2014-2022'],
   'Kit de frenos de calidad OEM para camiones comerciales pesados. Incluye dos discos y juegos de pastillas para el eje delantero, con máxima disipación de calor.',
   '{"Diámetro del disco":"430mm","Grosor del disco":"45mm","Material de pastilla":"Semimetálico","Carga por eje":"Hasta 13,000 kg"}'::jsonb,
   '12 meses / 200,000 km', 'NEW'),

  ('P010', 'Kit completo de faja de tiempo', 'Gates', 'engine', 'SG-TB-4490', 'GATES-K015606XS',
   195.00, null, 30, 5,
   array['Hyundai Tucson 2.0 2010-2015','Kia Sportage 2.0 2010-2015'],
   'Kit completo con faja de tiempo, tensor, polea guía y bomba de agua. El reemplazo conjunto asegura componentes nuevos y compatibles.',
   '{"Longitud de faja":"141T / 1410mm","Ancho de faja":"25.4mm","Incluye":"Faja, tensor, polea guía y bomba de agua","Material":"Caucho EPDM"}'::jsonb,
   '2 años / 60,000 km', 'POPULAR'),

  ('P011', 'Batería 12 V 70 Ah 640 A libre de mantenimiento', 'Varta', 'electrical', 'SG-BA-0070', 'VAR-570144064',
   129.00, null, 35, 8,
   array['Universal para vehículos que requieren batería de 70 Ah formato LB3'],
   'Batería de plomo-ácido libre de mantenimiento con tecnología AGM. Excelente rendimiento en temperaturas extremas y arranque confiable.',
   '{"Capacidad":"70 Ah","Amperaje de arranque en frío":"640 A (EN)","Voltaje":"12 V","Formato":"LB3","Polaridad":"Positivo derecho"}'::jsonb,
   '24 meses', 'ACTIVE'),

  ('P012', 'Conjunto de ballesta trasera para trabajo pesado', 'Monroe', 'heavy-duty', 'SG-LS-0998', 'MON-LS345-R',
   245.00, null, 12, 3,
   array['Toyota Land Cruiser 70 Series 2007-2022','Toyota Hilux Vigo 2005-2015'],
   'Conjunto reforzado de ballestas para gran capacidad de carga. El diseño parabólico reduce peso sin perder resistencia. Incluye accesorios de instalación.',
   '{"Hojas":"5","Arco libre":"78mm","Distancia entre apoyos":"1480mm","Posición":"Trasera derecha","Capacidad de carga":"Hasta 1,200 kg"}'::jsonb,
   '18 meses / kilometraje ilimitado', 'ACTIVE');

-- --- Clientes ----------------------------------------------------------------
insert into public.customers (id, first_name, last_name, email, phone, orders, total_purchases, status, registered_at) values
  ('C001','Carlos','Mendoza','carlos.mendoza@email.com','+502 7890-1234',14,3840.50,'active','2024-01-15'),
  ('C002','Ana','García','ana.garcia@email.com','+502 7234-5678',7,1205.75,'active','2024-03-22'),
  ('C003','Roberto','Flores','r.flores@mecanicarobert.com','+502 7456-7890',28,12450.00,'active','2023-08-10'),
  ('C004','María','López','mlopez@email.com','+502 7123-4567',3,340.20,'active','2024-07-01'),
  ('C005','Juan','Martínez','juan.m@transportes.com','+502 7789-0123',42,28900.00,'active','2023-02-14'),
  ('C006','Diana','Vásquez','diana.v@email.com','+502 7345-6789',1,55.00,'inactive','2024-09-10');

-- --- Pedidos -----------------------------------------------------------------
insert into public.orders (id, customer_id, customer_name, date, status, subtotal, discount, shipping, total, payment_method, delivery_method, address) values
  ('ORD-2024-0892','C003','Roberto Flores','2024-09-20','Delivered',345.94,0,15.00,360.94,'Pedido por WhatsApp','Entrega a domicilio','Zona 10, 12 calle 3-45, Ciudad de Guatemala'),
  ('ORD-2024-0901','C001','Carlos Mendoza','2024-09-23','Shipped',195.00,0,0,195.00,'Pedido por WhatsApp','Recoger en tienda','Recoger en tienda — SIGO Autorepuestos'),
  ('ORD-2024-0915','C005','Juan Martínez','2024-09-24','Confirmed',1530.00,50.00,25.00,1505.00,'Pedido por WhatsApp','Entrega a domicilio','Zona 12, Calzada Atanasio Tzul, Ciudad de Guatemala'),
  ('ORD-2024-0922','C002','Ana García','2024-09-25','Pending',117.00,0,10.00,127.00,'Solicitud por WhatsApp','Entrega a domicilio','Zona 1, 6a avenida 8-12, Quetzaltenango'),
  ('ORD-2024-0910','C005','Juan Martínez','2024-09-22','Preparing',320.00,0,20.00,340.00,'Pedido por WhatsApp','Entrega a domicilio','Zona 12, Calzada Atanasio Tzul, Ciudad de Guatemala');

insert into public.order_items (order_id, product_id, product_name, product_code, quantity, unit_price) values
  ('ORD-2024-0892','P001','Juego de pastillas de freno cerámicas premium','SG-BP-0234',2,74.99),
  ('ORD-2024-0892','P006','Aceite de motor sintético SAE 5W-30 de 5 L','SG-MO-2210',4,48.99),
  ('ORD-2024-0901','P010','Kit completo de faja de tiempo','SG-TB-4490',1,195.00),
  ('ORD-2024-0915','P009','Kit de freno de disco para camión, eje delantero','SG-HB-0012',2,520.00),
  ('ORD-2024-0915','P012','Conjunto de ballesta trasera para trabajo pesado','SG-LS-0998',2,245.00),
  ('ORD-2024-0922','P003','Juego de 4 candelas de iridio de larga duración','SG-SP-0088',1,68.00),
  ('ORD-2024-0922','P002','Filtro de aceite de motor para trabajo pesado','SG-OF-1122',2,24.50),
  ('ORD-2024-0910','P007','Kit de embrague de 3 piezas','SG-CK-3301',1,320.00);
