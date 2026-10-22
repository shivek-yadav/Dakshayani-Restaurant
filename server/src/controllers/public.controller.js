/** Business controllers for public. Route wiring is kept separately. */
import { z } from 'zod';
import { Category, MenuItem, GalleryImage, FAQ, Testimonial, PageContent, SiteSettings, Inquiry } from '../models/index.js';
import { wrap, parse } from '../lib/utils.js';
const publicSettings = (s) => s ? { restaurantName: s.restaurantName, tagline: s.tagline, phone: s.phone, email: s.email, address: s.address, city: s.city, mapUrl: s.mapUrl, instagram: s.instagram, facebook: s.facebook, openingHours: s.openingHours, bookingEnabled: s.bookingEnabled, orderingEnabled: s.orderingEnabled, deliveryEnabled: s.deliveryEnabled, deliveryFee: s.deliveryFee, reservationMaxGuests: s.reservationMaxGuests } : {};
const inquirySchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email().max(150), phone: z.string().max(30).optional().default(''), subject: z.string().max(150).optional().default(''), message: z.string().trim().min(10).max(2500) });
export const get_settings_public = wrap(async (req, res) => res.json({ data: publicSettings(await SiteSettings.findOne({ key: 'primary' })) }));
export const get_categories = wrap(async (req, res) => res.json({ data: await Category.find({ published: true }).sort({ sortOrder: 1, name: 1 }).lean() }));
export const get_menu = wrap(async (req, res) => {
    const filter = { published: true };
    if (req.query.featured === 'true')
        filter.featured = true;
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.search)
        filter.name = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 60), $options: 'i' };
    const data = await MenuItem.find(filter).populate('category', 'name slug').sort({ featured: -1, name: 1 }).limit(150).lean();
    res.json({ data });
});
export const get_menu_slug = wrap(async (req, res) => {
    const data = await MenuItem.findOne({ slug: req.params.slug, published: true }).populate('category', 'name slug');
    if (!data)
        return res.status(404).json({ message: 'Dish not found' });
    res.json({ data });
});
export const get_gallery = wrap(async (req, res) => res.json({ data: await GalleryImage.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean() }));
export const get_faqs = wrap(async (req, res) => res.json({ data: await FAQ.find({ published: true }).sort({ sortOrder: 1 }).lean() }));
export const get_testimonials = wrap(async (req, res) => res.json({ data: await Testimonial.find({ published: true }).sort({ createdAt: -1 }).limit(12).lean() }));
export const get_pages_slug = wrap(async (req, res) => {
    const data = await PageContent.findOne({ slug: req.params.slug, published: true }).lean();
    if (!data)
        return res.status(404).json({ message: 'Page not found' });
    res.json({ data });
});
export const post_inquiries = wrap(async (req, res) => {
    const data = parse(inquirySchema, req.body);
    await Inquiry.create(data);
    res.status(201).json({ message: 'Thank you! We will get back to you shortly.' });
});
