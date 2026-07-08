/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Nursery, NurseryRegistration, Order } from './types';

export const MOCK_NURSERIES: Nursery[] = [
  {
    id: 'nursery-1',
    name: 'Riyadh Green Oasis',
    arabicName: 'مشتل واحة الرياض الخضراء',
    location: 'Diriyah, Riyadh',
    taxId: '310293847200003',
    crNumber: '1010394852',
    rating: 4.8,
    walletBalance: 12450.00,
    settlementHistory: [
      {
        id: 'settle-1',
        date: '2026-06-30',
        amount: 8500.00,
        status: 'Transferred',
        referenceNumber: 'TXN-93810294',
        bankName: 'Al Rajhi Bank'
      },
      {
        id: 'settle-2',
        date: '2026-06-15',
        amount: 9800.00,
        status: 'Transferred',
        referenceNumber: 'TXN-82710394',
        bankName: 'Al Rajhi Bank'
      }
    ]
  },
  {
    id: 'nursery-2',
    name: 'Red Sea Botanical Flora',
    arabicName: 'مشتل فلورا البحر الأحمر النباتية',
    location: 'Al-Hamra, Jeddah',
    taxId: '310847294800003',
    crNumber: '4030582948',
    rating: 4.6,
    walletBalance: 8120.00,
    settlementHistory: [
      {
        id: 'settle-3',
        date: '2026-06-25',
        amount: 5400.00,
        status: 'Transferred',
        referenceNumber: 'TXN-74629481',
        bankName: 'Saudi National Bank (SNB)'
      }
    ]
  },
  {
    id: 'nursery-3',
    name: 'Al-Hasa Palms & Trees',
    arabicName: 'مشتل نخيل وأشجار الأحساء',
    location: 'Hofuf, Al-Ahsa',
    taxId: '310572948100003',
    crNumber: '2050482931',
    rating: 4.9,
    walletBalance: 18400.00,
    settlementHistory: [
      {
        id: 'settle-4',
        date: '2026-06-20',
        amount: 14500.00,
        status: 'Transferred',
        referenceNumber: 'TXN-49201948',
        bankName: 'Riyad Bank'
      }
    ]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Ficus Lyrata (Fiddle-Leaf Fig)',
    arabicName: 'تين مرن (فيكس ليراتا)',
    category: 'Indoor Plants',
    price: 180.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=600',
    description: 'The elegant Ficus Lyrata features large, heavily veined, violin-shaped leaves that grow upright. Perfect for introducing sculptural greenery to corporate offices or modern Saudi living rooms. Highly sensitive to direct light.',
    arabicDescription: 'تتميز تين ليراتا الأنيقة بأوراقها الكبيرة الشبيهة بآلة الكمان ذات العروق البارزة. مثالية لإضافة لمسة جمالية راقية للمكاتب وغرف المعيشة الحديثة. حساسة للضوء المباشر.',
    rating: 4.7,
    reviewsCount: 34,
    stock: 25,
    size: 'Large',
    matchedNurseryId: 'nursery-1'
  },
  {
    id: 'prod-2',
    name: 'Local Olive Tree (Zaitoon)',
    arabicName: 'شجرة زيتون بلدي',
    category: 'Outdoor Trees',
    price: 450.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1445294211564-3ca59d999abd?auto=format&fit=crop&q=80&w=600',
    description: 'A drought-resistant, highly resilient local olive tree. Excellent for gardens, patios, and landscaping across the Gulf region. Prefers full sun and moderate watering.',
    arabicDescription: 'شجرة زيتون محلية مقاومة للجفاف وعالية التحمل. ممتازة للحدائق المنزلية والمناظر الطبيعية في منطقة الخليج. تفضل أشعة الشمس الكاملة والري المعتدل.',
    rating: 4.9,
    reviewsCount: 58,
    stock: 12,
    size: 'Extra Large',
    matchedNurseryId: 'nursery-3'
  },
  {
    id: 'prod-3',
    name: 'Snake Plant (Sansevieria)',
    arabicName: 'نبات جلد النمر (سنسيفيريا)',
    category: 'Indoor Plants',
    price: 85.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
    description: 'One of the most resilient indoor plants available. Known for its air-purifying qualities, it thrives on neglect and is highly suited for air-conditioned indoor spaces.',
    arabicDescription: 'واحدة من أكثر النباتات المنزلية تحملاً. معروفة بخصائصها الفائقة في تنقية الهواء، وتنمو بشكل ممتاز في الأماكن المغلقة والمكيفة مع ري قليل جداً.',
    rating: 4.5,
    reviewsCount: 112,
    stock: 45,
    size: 'Medium',
    matchedNurseryId: 'nursery-1'
  },
  {
    id: 'prod-4',
    name: 'Monstera Deliciosa (Swiss Cheese Plant)',
    arabicName: 'نبات القفص الصدري (مونستيرا)',
    category: 'Indoor Plants',
    price: 220.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=600',
    description: 'With its iconic split leaves, this Monstera brings a lush, tropical feel to any interior setting. Thrives in bright, indirect sunlight and humidified spaces.',
    arabicDescription: 'بأوراقها المقسمة الشهيرة، تضفي المونستيرا طابعاً استوائياً غنياً على أي مساحة داخلية. تنمو بشكل أفضل في الضوء غير المباشر الساطع وبيئة معتدلة الرطوبة.',
    rating: 4.8,
    reviewsCount: 42,
    stock: 18,
    size: 'Large',
    matchedNurseryId: 'nursery-2'
  },
  {
    id: 'prod-5',
    name: 'Bougainvillea Spectabilis (Jahannameyah)',
    arabicName: 'نبات الجهنمية (المجنونة)',
    category: 'Flowering Plants',
    price: 130.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=600',
    description: 'An extremely vibrant climbing shrub with dense clusters of papery purplish-pink bracts. Highly heat-tolerant and thrives spectacularly in direct sunlight.',
    arabicDescription: 'شجيرة متسلقة حيوية للغاية مع كتل كثيفة من الزهور الوردية والأرجوانية الورقية. قوية جداً ومقاومة للحرارة وتزدهر بشكل رائع تحت أشعة الشمس المباشرة.',
    rating: 4.6,
    reviewsCount: 29,
    stock: 30,
    size: 'Large',
    matchedNurseryId: 'nursery-2'
  },
  {
    id: 'prod-6',
    name: 'Desert Rose (Adenium)',
    arabicName: 'وردة الصحراء (أدينيوم)',
    category: 'Flowering Plants',
    price: 110.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&q=80&w=600',
    description: 'An architectural succulent with a thick swollen trunk and striking pink trumpeted flowers. Adapted beautifully to desert climates.',
    arabicDescription: 'نبتة عصارية معمارية بجذع سميك ومنتفخ وأزهار وردية مذهلة على شكل بوق. متكيفة تماماً مع المناخ الصحراوي.',
    rating: 4.7,
    reviewsCount: 19,
    stock: 15,
    size: 'Small',
    matchedNurseryId: 'nursery-3'
  },
  {
    id: 'prod-7',
    name: 'Aloe Vera Barbadensis',
    arabicName: 'نبات الصبار (ألو فيرا)',
    category: 'Succulents & Cacti',
    price: 45.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
    description: 'Famous succulent valued for its soothing inner gel. Extremely easy to care for, requires minimal watering and enjoys plenty of ambient light.',
    arabicDescription: 'نبات عصاري شهير يشتهر بهلامه الداخلي المهدئ. سهل العناية به للغاية، ويتطلب حداً أدنى من الري ويفضل الضوء المحيط القوي.',
    rating: 4.4,
    reviewsCount: 88,
    stock: 50,
    size: 'Small',
    matchedNurseryId: 'nursery-1'
  },
  {
    id: 'prod-8',
    name: 'Premium Ergonomic Pruning Shears',
    arabicName: 'مقص تقليم مريح ومميز',
    category: 'Gardening Equipment',
    price: 95.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    description: 'Professional-grade gardening shears made of hardened Japanese steel. Designed with non-slip handles for precise and comfortable tree care and pruning.',
    arabicDescription: 'مقص حدائق احترافي مصنوع من الفولاذ الياباني المعالج. مصمم بمقابض مانعة للانزلاق لتقليم مريح ودقيق للأشجار والشجيرات.',
    rating: 4.8,
    reviewsCount: 23,
    stock: 20,
    size: 'One Size',
    matchedNurseryId: 'nursery-2'
  },
  {
    id: 'prod-9',
    name: 'Premium Smart Watering Timer',
    arabicName: 'مؤقت ري ذكي ومميز',
    category: 'Gardening Equipment',
    price: 299.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    description: 'An automated solar-charged smart tap timer. Essential for matching dry-weather water schedules, saving up to 40% of water through automated nightly intervals.',
    arabicDescription: 'مؤقت صنبور ذكي يعمل بالطاقة الشمسية لتنظيم الري تلقائياً. ضروري لمواجهة فترات الجفاف وتوفير ما يصل إلى 40% من المياه عبر فترات ري ليلية مبرمجة.',
    rating: 4.9,
    reviewsCount: 16,
    stock: 12,
    size: 'One Size',
    matchedNurseryId: 'nursery-1'
  },
  {
    id: 'prod-10',
    name: 'Heavy Duty Brass Spray Nozzle Set',
    arabicName: 'طقم فوهات رش نحاسية ثقيلة',
    category: 'Gardening Equipment',
    price: 120.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    description: 'Solid brass heavy-duty watering nozzles with variable mist patterns. Perfect for fragile indoor plants and large outdoor garden trees.',
    arabicDescription: 'فوهات رش ري قوية مصنوعة من النحاس الصلب مع أنماط رش متعددة ومختلفة. مثالية للشتلات الداخلية الرقيقة وأشجار الحدائق الخارجية الكبيرة.',
    rating: 4.7,
    reviewsCount: 31,
    stock: 25,
    size: 'Standard',
    matchedNurseryId: 'nursery-2'
  },
  {
    id: 'prod-11',
    name: 'Organic Mineral Potting Soil Blend (50L)',
    arabicName: 'تربة زراعية عضوية غنية بالمعادن (50 لتر)',
    category: 'Gardening Equipment',
    price: 65.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=600',
    description: 'Supercharged organic premium potting mix formulated for rapid root growth in sandy or high-temperature clay zones. Retains moisture for up to 72 hours.',
    arabicDescription: 'مزيج تربة زراعية عضوي فائق التغذية لنمو جذري سريع في المناطق الرملية أو الطينية شديدة الحرارة. يحتفظ بالرطوبة لمدة تصل إلى 72 ساعة.',
    rating: 4.6,
    reviewsCount: 44,
    stock: 100,
    size: '50 Liters',
    matchedNurseryId: 'nursery-3'
  },
  {
    id: 'prod-12',
    name: 'Premium Terracotta Clay Planter Set',
    arabicName: 'طقم أحواض فخارية فاخرة (تيراكوتا)',
    category: 'Gardening Equipment',
    price: 145.00,
    vatRate: 0.15,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600',
    description: 'Handcrafted natural clay terracotta pots that allow root respiration and prevent water logging. Beautiful rustic aesthetic that pairs perfectly with desert palms.',
    arabicDescription: 'أصص فخارية مصنوعة يدوياً من الطين الطبيعي تسمح بتنفس الجذور وتمنع تجمع المياه الزائدة. تضفي جمالية ريفية مميزة تتناسب مع نباتات الصحراء.',
    rating: 4.8,
    reviewsCount: 20,
    stock: 15,
    size: 'Set of 3',
    matchedNurseryId: 'nursery-1'
  }
];

export const MOCK_REGISTRATIONS: NurseryRegistration[] = [
  {
    id: 'reg-1',
    name: 'Yasmine Al-Khobar Gardens',
    arabicName: 'حدائق ياسمين الخبر',
    ownerName: 'Abdulrahman Al-Subaie',
    crNumber: '2051093847',
    taxId: '310928374600003',
    phone: '+966 50 123 4567',
    email: 'contact@yasminegardens.sa',
    city: 'Khobar',
    status: 'Pending',
    submittedDate: '2026-07-05'
  },
  {
    id: 'reg-2',
    name: 'Taif Rose Center',
    arabicName: 'مركز ورد الطائف الزراعي',
    ownerName: 'Faisal Al-Thaqafi',
    crNumber: '4031083948',
    taxId: '310482938100003',
    phone: '+966 55 987 6543',
    email: 'info@taifrose.com.sa',
    city: 'Taif',
    status: 'Pending',
    submittedDate: '2026-07-06'
  },
  {
    id: 'reg-3',
    name: 'Najd Greenhouses',
    arabicName: 'بيوت نجد المحمية',
    ownerName: 'Khalid Al-Muqrin',
    crNumber: '1010582938',
    taxId: '310294817200003',
    phone: '+966 54 555 1212',
    email: 'operations@najdgreen.sa',
    city: 'Riyadh',
    status: 'Approved',
    submittedDate: '2026-06-12'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    date: '2026-07-07 14:30',
    customerName: 'Mohammed Al-Ghamdi',
    customerPhone: '+966 53 444 8899',
    customerEmail: 'm.ghamdi@outlook.sa',
    customerAddress: 'Al-Nafal District, Block 4, Villa 12',
    city: 'Riyadh',
    items: [
      {
        product: MOCK_PRODUCTS[0], // Ficus Lyrata, 180 SAR
        quantity: 2
      },
      {
        product: MOCK_PRODUCTS[2], // Snake Plant, 85 SAR
        quantity: 1
      }
    ],
    totalAmount: 445.00, // 180*2 + 85 = 445 (includes VAT)
    vatAmount: 58.04, // 15% of VATable base: 445 - (445 / 1.15) = 58.04
    status: 'Delivered',
    paymentMethod: 'mada',
    matchedNurseryId: 'nursery-1',
    matchedNurseryName: 'Riyadh Green Oasis',
    matchingRuleApplied: 'Proximity (Within 5km) - Optimized Logistics',
    zatcaInvoiceNumber: 'INV-20260707-1001',
    zatcaQrCodeValue: 'Seller: Riyadh Green Oasis | TaxID: 310293847200003 | Date: 2026-07-07T14:30:00Z | Total: 445.00 SAR | VAT: 58.04 SAR',
    deliveryRating: 5,
    productRating: 5,
    ratingFeedback: 'The Ficus Lyrata is robust and very well packaged! Shipped within 3 hours. Outstanding service.',
    invoiceUploadedByNursery: true
  },
  {
    id: 'ord-1002',
    date: '2026-07-08 09:15',
    customerName: 'Sarah Al-Harbi',
    customerPhone: '+966 56 123 9876',
    customerEmail: 'sarah.harbi@gmail.com',
    customerAddress: 'An Naeem District, Street 12',
    city: 'Jeddah',
    items: [
      {
        product: MOCK_PRODUCTS[3], // Monstera, 220 SAR
        quantity: 1
      },
      {
        product: MOCK_PRODUCTS[4], // Bougainvillea, 130 SAR
        quantity: 2
      }
    ],
    totalAmount: 480.00, // 220 + 130*2 = 480
    vatAmount: 62.61, // 480 - (480 / 1.15) = 62.61
    status: 'Preparing',
    paymentMethod: 'visa',
    matchedNurseryId: 'nursery-2',
    matchedNurseryName: 'Red Sea Botanical Flora',
    matchingRuleApplied: 'Proximity (Jeddah Hub) - Direct Regional Match',
    zatcaInvoiceNumber: 'INV-20260708-1002',
    zatcaQrCodeValue: 'Seller: Red Sea Botanical Flora | TaxID: 310847294800003 | Date: 2026-07-08T09:15:00Z | Total: 480.00 SAR | VAT: 62.61 SAR',
    invoiceUploadedByNursery: false
  },
  {
    id: 'ord-1003',
    date: '2026-07-08 10:45',
    customerName: 'Fahad Al-Dosari',
    customerPhone: '+966 59 777 6655',
    customerEmail: 'f.dosari@yahoo.com',
    customerAddress: 'Al-Rayyan District, Prince Majid Road',
    city: 'Riyadh',
    items: [
      {
        product: MOCK_PRODUCTS[1], // Olive Tree, 450 SAR
        quantity: 1
      }
    ],
    totalAmount: 450.00,
    vatAmount: 58.70, // 450 - (450/1.15) = 58.70
    status: 'Received',
    paymentMethod: 'mastercard',
    matchedNurseryId: 'nursery-3',
    matchedNurseryName: 'Al-Hasa Palms & Trees',
    matchingRuleApplied: 'Direct Specialty Sourcing (Exclusive Premium Olive Stock)',
    zatcaInvoiceNumber: 'INV-20260708-1003',
    zatcaQrCodeValue: 'Seller: Al-Hasa Palms & Trees | TaxID: 310572948100003 | Date: 2026-07-08T10:45:00Z | Total: 450.00 SAR | VAT: 58.70 SAR',
    invoiceUploadedByNursery: false
  }
];

export const CATEGORIES = [
  'All Plants',
  'Indoor Plants',
  'Outdoor Trees',
  'Flowering Plants',
  'Succulents & Cacti',
  'Gardening Equipment'
];

export const SAUDI_CITIES = [
  'Riyadh',
  'Jeddah',
  'Dammam',
  'Mecca',
  'Medina',
  'Khobar',
  'Al-Ahsa',
  'Taif'
];
