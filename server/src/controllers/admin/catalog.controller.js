import { Order, MenuItem } from '../../models/index.js';
import { ensure, validId, pick, slug } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
/** Generic, field-whitelisted CRUD for small CMS collections. */
export const catalogHandlers = (name, config) => ({
    list: async (req, res) => res.json({ data: await config.model.find().sort(config.sort).limit(500).lean() }),
    create: async (req, res) => {
        const data = pick(req.body || {}, config.fields);
        for (const field of config.create)
            ensure(data[field] !== undefined && data[field] !== null && data[field] !== '', 400, `${field} is required`);
        if (config.fields.includes('slug'))
            data.slug = slug(data.slug || data.name);
        const record = await config.model.create(data);
        await log(req, 'create', name, record._id);
        res.status(201).json({ data: record, message: 'Created successfully' });
    },
    update: async (req, res) => {
        ensure(validId(req.params.id), 400, 'Invalid ID');
        const data = pick(req.body || {}, config.fields);
        if (data.slug)
            data.slug = slug(data.slug);
        const record = await config.model.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true });
        ensure(record, 404, 'Record not found');
        await log(req, 'update', name, record._id);
        res.json({ data: record, message: 'Saved successfully' });
    },
    remove: async (req, res) => {
        ensure(validId(req.params.id), 400, 'Invalid ID');
        if (name === 'categories')
            ensure(!(await MenuItem.exists({ category: req.params.id })), 409, 'Category has menu items; move dishes before deleting');
        if (name === 'menu')
            ensure(!(await Order.exists({ 'items.menuItem': req.params.id })), 409, 'Dish has order history; unpublish instead of deleting');
        const record = await config.model.findByIdAndDelete(req.params.id);
        ensure(record, 404, 'Record not found');
        await log(req, 'delete', name, req.params.id);
        res.json({ message: 'Deleted successfully' });
    }
});
