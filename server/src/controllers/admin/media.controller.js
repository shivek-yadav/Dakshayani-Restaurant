/** Admin media controllers. */
import ImageKit from 'imagekit';
import { wrap, ensure } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const post_upload = wrap(async (req, res) => {
    ensure(req.file, 400, 'Image file is required');
    ensure(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT, 503, 'ImageKit is not configured. Add keys to server/.env');
    const imagekit = new ImageKit({ publicKey: process.env.IMAGEKIT_PUBLIC_KEY, privateKey: process.env.IMAGEKIT_PRIVATE_KEY, urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT });
    const result = await imagekit.upload({ file: req.file.buffer, fileName: `dakshayani-${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '')}`, folder: '/dakshayani', useUniqueFileName: true });
    await log(req, 'upload', 'image', result.fileId);
    res.status(201).json({ data: { url: result.url, fileId: result.fileId, name: result.name } });
});
