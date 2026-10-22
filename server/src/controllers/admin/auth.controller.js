/** Admin auth controllers. */
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';
import { issueCookie } from '../../middlewares/auth.middleware.js';
import { wrap, parse, httpError, clean } from '../../lib/utils.js';
export const post_auth_login = wrap(async (req, res) => {
    const d = parse(z.object({ email: z.string().email(), password: z.string().min(1) }), req.body);
    const user = await User.findOne({ email: d.email.toLowerCase(), role: 'admin', status: 'active' }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(d.password, user.passwordHash)))
        throw httpError(401, 'Invalid admin credentials');
    user.lastLogin = new Date();
    await user.save();
    issueCookie(res, user);
    res.json({ user: clean(user), message: 'Welcome back' });
});
export const get_auth_me = (req, res) => res.json({ user: clean(req.user) });
