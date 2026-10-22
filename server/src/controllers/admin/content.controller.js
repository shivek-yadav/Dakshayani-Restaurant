/** Admin content controllers. */
import { z } from 'zod';
import { PageContent } from '../../models/index.js';
import { wrap, parse, slug } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const get_content = wrap(async (req, res) => res.json({ data: await PageContent.find().sort({ slug: 1 }).lean() }));
export const put_content_slug = wrap(async (req, res) => {
    const d = parse(z.object({ title: z.string().max(200).optional(), subtitle: z.string().max(300).optional(), description: z.string().max(2000).optional(), heroImage: z.string().max(1500).optional(), body: z.string().max(20000).optional(), published: z.boolean().optional() }), req.body);
    const record = await PageContent.findOneAndUpdate({ slug: req.params.slug }, { $set: d, $setOnInsert: { slug: req.params.slug } }, { new: true, upsert: true, runValidators: true });
    await log(req, 'update', 'content', record._id);
    res.json({ data: record, message: 'Page saved' });
});
