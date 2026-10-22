
import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import {
  User,
  Category,
  MenuItem,
  GalleryImage,
  FAQ,
  Testimonial,
  PageContent,
  SiteSettings,
} from '../src/models/index.js';

// Google DNS for SRV lookups.
// If your network blocks Google DNS, configure DNS at Windows/network level.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const categories = [
  ['Signature Curries', 'Slow-simmered classics'],
  ['Tandoor & Grills', 'Flame-kissed favourites'],
  ['Biryani & Rice', 'Fragrant, beautiful rice'],
  ['Indian Breads', 'Freshly baked from our tandoor'],
  ['Starters & Chaat', 'Perfect beginnings'],
  ['Desserts & Drinks', 'A sweet final note'],
];

const menu = [
  ['Royal Paneer Lababdar', 'Signature Curries', 349, 'Soft cottage cheese simmered in a velvety tomato-cashew gravy, finished with cream.', 'photo-1631452180519-c014fe946bc7', true, true, false],
  ['Dakshayani Butter Chicken', 'Signature Curries', 429, 'Tender tandoori chicken folded into our famous smoky makhani sauce.', 'photo-1603894584373-5ac82b2ae398', false, true, false],
  ['Dal Makhani Heritage', 'Signature Curries', 299, 'Black lentils slow-cooked overnight with butter and warming spices.', 'photo-1546833999-b9f581a1996d', true, true, false],
  ['Kadhai Paneer', 'Signature Curries', 329, 'Paneer, peppers and crushed coriander in a vibrant kadhai masala.', 'photo-1631452180519-c014fe946bc7', true, false, true],
  ['Tandoori Chicken Tikka', 'Tandoor & Grills', 389, 'Yogurt-marinated chicken grilled over charcoal, mint chutney on the side.', 'photo-1599487488170-d11ec9c172f0', false, true, true],
  ['Malai Soya Chaap', 'Tandoor & Grills', 319, 'Creamy, gently spiced soya morsels charred to perfection.', 'photo-1626777552726-4a6b54e52b27', true, false, false],
  ['Hyderabadi Dum Biryani', 'Biryani & Rice', 399, 'Slow-sealed basmati rice infused with saffron, herbs and aromatic spices.', 'photo-1563379091339-03246963d96c', false, true, true],
  ['Vegetable Dum Biryani', 'Biryani & Rice', 329, 'Fragrant basmati rice layered with seasonal vegetables and royal spices.', 'photo-1563379091339-03246963d96c', true, false, false],
  ['Garlic Butter Naan', 'Indian Breads', 89, 'Fresh from the tandoor, brushed with garlic butter and cilantro.', 'photo-1610057099431-d73a1c9d2f2f', true, false, false],
  ['Amritsari Kulcha', 'Indian Breads', 119, 'Stuffed crisp bread with homemade spice blend and butter.', 'photo-1626777552726-4a6b54e52b27', true, false, false],
  ['Dahi Ke Kebab', 'Starters & Chaat', 279, 'Golden, delicate yogurt kebabs paired with green chutney.', 'photo-1546833999-b9f581a1996d', true, false, false],
  ['Palak Patta Chaat', 'Starters & Chaat', 249, 'Crispy spinach leaves with tamarind, yogurt and jewel-like pomegranate.', 'photo-1601050690597-df0568f70950', true, false, false],
  ['Gulab Jamun', 'Desserts & Drinks', 149, 'Warm saffron-soaked dumplings served with pistachio.', 'photo-1601303516534-bf0b8650a0bc', true, false, false],
  ['Saffron Phirni', 'Desserts & Drinks', 169, 'Chilled rice pudding delicately infused with cardamom and saffron.', 'photo-1666190094768-9ca57d82a59b', true, false, false],
  ['Mango Lassi', 'Desserts & Drinks', 139, 'Refreshing, creamy mango yogurt with a touch of cardamom.', 'photo-1571006685759-4e238aac18c3', true, false, false],
];

const gallery = [
  ['The dining room', 'Ambience', 'photo-1517248135467-4c7edcad34c4'],
  ['An evening at Dakshayani', 'Ambience', 'photo-1552566626-52f8b828add9'],
  ['A feast worth sharing', 'Food', 'photo-1504674900247-0877df9cc836'],
  ['Straight from the kitchen', 'Food', 'photo-1546833999-b9f581a1996d'],
  ['Crafted with care', 'Food', 'photo-1631452180519-c014fe946bc7'],
  ['The little details', 'Ambience', 'photo-1414235077428-338989a2e8c0'],
];

const faqs = [
  ['Do I need a reservation?', 'Walk-ins are welcome, but we recommend reserving a table for weekends and special occasions.'],
  ['Do you have vegetarian dishes?', 'Absolutely. Our menu features a generous selection of vegetarian favourites and freshly prepared dishes.'],
  ['Can I order food online?', 'Yes! Browse our menu, add dishes to your cart and choose pickup (or delivery, when enabled).'],
  ['How are reservations confirmed?', 'Your booking is a request until our team confirms it. You can see the latest status in your account.'],
];

const testimonials = [
  ['Aarav Sharma', 'The food was absolutely delightful. Every dish tasted like a celebration, and the hospitality was exceptional.'],
  ['Meera Kapoor', 'Such a beautiful space for family dinners. The dal makhani and paneer are must-tries!'],
  ['Riya Malhotra', 'A wonderful balance of authentic flavours and a warm, contemporary atmosphere.'],
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in server/.env'
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await User.findOne({ email });

  if (admin) {
    admin.name = 'Dakshayani Admin';
    admin.passwordHash = passwordHash;
    admin.role = 'admin';
    await admin.save();
    console.log(`Admin account updated: ${email}`);
  } else {
    await User.create({
      name: 'Dakshayani Admin',
      email,
      passwordHash,
      role: 'admin',
    });
    console.log(`Admin account created: ${email}`);
  }
}

async function seedDemoCustomer() {
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping demo customer in production.');
    return;
  }

  const email = 'guest@dakshayani.local';
  const passwordHash = await bcrypt.hash('DemoGuest123!', 12);

  const customer = await User.findOne({ email });

  if (!customer) {
    await User.create({
      name: 'Demo Guest',
      email,
      phone: '9876543210',
      passwordHash,
      role: 'customer',
    });
    console.log('Demo customer created.');
  } else {
    console.log('Demo customer already exists; existing account preserved.');
  }
}

async function seedCategories() {
  const categoryIds = {};

  for (let i = 0; i < categories.length; i++) {
    const [name, description] = categories[i];
    const slug = slugify(name);

    const category = await Category.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: {
          name,
          slug,
          description,
          sortOrder: i,
          published: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    categoryIds[name] = category._id;
  }

  console.log(`${categories.length} categories checked.`);
  return categoryIds;
}

async function seedMenu(categoryIds) {
  for (const [
    name,
    category,
    price,
    description,
    photo,
    vegetarian,
    featured,
    spicy,
  ] of menu) {
    const slug = slugify(name);

    await MenuItem.updateOne(
      { slug },
      {
        $setOnInsert: {
          name,
          slug,
          category: categoryIds[category],
          price,
          description,
          image: img(photo),
          vegetarian,
          featured,
          spicy,
          popular: featured,
          available: true,
          published: true,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`${menu.length} menu items checked.`);
}

async function seedGallery() {
  for (let i = 0; i < gallery.length; i++) {
    const [title, category, photo] = gallery[i];

    await GalleryImage.updateOne(
      { title },
      {
        $setOnInsert: {
          title,
          category,
          url: img(photo, 1200),
          sortOrder: i,
          published: true,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`${gallery.length} gallery images checked.`);
}

async function seedFAQs() {
  for (let i = 0; i < faqs.length; i++) {
    const [question, answer] = faqs[i];

    await FAQ.updateOne(
      { question },
      {
        $setOnInsert: {
          question,
          answer,
          sortOrder: i,
          published: true,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`${faqs.length} FAQs checked.`);
}

async function seedTestimonials() {
  for (const [name, quote] of testimonials) {
    await Testimonial.updateOne(
      { name },
      {
        $setOnInsert: {
          name,
          quote,
          rating: 5,
          published: true,
        },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`${testimonials.length} testimonials checked.`);
}

async function seedPages() {
  const pages = [
    {
      slug: 'home',
      title: 'A little tradition.',
      subtitle: 'A lot of love.',
      description: 'Discover the warmth of Indian hospitality, the magic of timeless recipes, and flavours that feel like home.',
      heroImage: img('photo-1517248135467-4c7edcad34c4', 1800),
    },
    {
      slug: 'about',
      title: 'Our story, served with love',
      subtitle: 'THE HEART BEHIND DAKSHAYANI',
      description: 'We bring people together through soulful Indian cuisine, treasured recipes, and genuine warmth.',
      heroImage: img('photo-1414235077428-338989a2e8c0', 1600),
    },
    {
      slug: 'menu',
      title: 'Our Menu',
      subtitle: 'EXPLORE OUR MENU',
      description: 'A delicious collection of classics, creative discoveries and family favourites.',
      heroImage: img('photo-1504674900247-0877df9cc836', 1600),
    },
  ];

  for (const page of pages) {
    await PageContent.updateOne(
      { slug: page.slug },
      { $setOnInsert: { ...page, published: true } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`${pages.length} page records checked.`);
}

async function seedSettings() {
  const hours = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => ({
    day,
    open: '11:00',
    close: '23:00',
    closed: false,
  }));

  await SiteSettings.updateOne(
    { key: 'primary' },
    {
      $setOnInsert: {
        key: 'primary',
        restaurantName: 'Dakshayani',
        tagline: 'The Art of Indian Dining',
        phone: '+91 98765 43210',
        email: 'hello@dakshayani.example',
        address: 'Your restaurant address, India',
        city: 'Your City',
        openingHours: hours,
        bookingEnabled: true,
        orderingEnabled: true,
        deliveryEnabled: false,
        deliveryFee: 50,
        reservationMaxGuests: 12,
        minReservationLeadHours: 2,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Restaurant settings checked.');
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error('Set MONGO_URI in server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected.');

  try {
    await seedAdmin();
    await seedDemoCustomer();

    const categoryIds = await seedCategories();
    await seedMenu(categoryIds);
    await seedGallery();
    await seedFAQs();
    await seedTestimonials();
    await seedPages();
    await seedSettings();

    console.log('Seed complete: admin, demo customer, menu and content are ready.');
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
});

