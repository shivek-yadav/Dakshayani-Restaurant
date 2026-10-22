import { Category, MenuItem, GalleryImage, FAQ, Testimonial } from '../models/index.js';
export const catalogConfig = {
    categories: { model: Category, fields: ['name', 'slug', 'description', 'image', 'sortOrder', 'published'], create: ['name'], sort: { sortOrder: 1, name: 1 } },
    menu: { model: MenuItem, fields: ['name', 'slug', 'description', 'price', 'category', 'image', 'imageFileId', 'vegetarian', 'featured', 'popular', 'spicy', 'available', 'published', 'prepMinutes'], create: ['name', 'description', 'price', 'category'], sort: { createdAt: -1 } },
    gallery: { model: GalleryImage, fields: ['title', 'category', 'url', 'imageFileId', 'sortOrder', 'published'], create: ['url'], sort: { sortOrder: 1, createdAt: -1 } },
    faqs: { model: FAQ, fields: ['question', 'answer', 'sortOrder', 'published'], create: ['question', 'answer'], sort: { sortOrder: 1 } },
    testimonials: { model: Testimonial, fields: ['name', 'quote', 'rating', 'published'], create: ['name', 'quote'], sort: { createdAt: -1 } },
};
