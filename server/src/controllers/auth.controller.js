/** Business controllers for auth. Route wiring is kept separately. */
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/index.js';
import { wrap, parse, httpError, clean } from '../lib/utils.js';
import { issueCookie, clearCookie } from '../middlewares/auth.middleware.js';
const email = z.string().trim().toLowerCase().email().max(150);
const password = z.string().min(8).max(128);
export const post_register = wrap(async (req, res) => {
    const d = parse(z.object({ name: z.string().trim().min(2).max(100), email, phone: z.string().max(25).optional().default(''), password }), req.body);
    if (await User.exists({ email: d.email }))
        throw httpError(409, 'Email is already registered');
    const user = await User.create({ name: d.name, email: d.email, phone: d.phone, passwordHash: await bcrypt.hash(d.password, 12), role: 'customer' });
    issueCookie(res, user);
    res.status(201).json({ message: 'Welcome to Dakshayani!', user: clean(user) });
});
export const post_login = wrap(async (req, res) => {
    const d = parse(z.object({ email, password }), req.body);
    const user = await User.findOne({ email: d.email }).select('+passwordHash');
    if (!user || user.role !== 'customer' || user.status !== 'active' || !(await bcrypt.compare(d.password, user.passwordHash)))
        throw httpError(401, 'Invalid email or password');
    user.lastLogin = new Date();
    await user.save();
    issueCookie(res, user);
    res.json({ message: 'Logged in successfully', user: clean(user) });
});
export const post_logout = wrap(async (req, res) => {
    req.user.sessionVersion = (req.user.sessionVersion || 0) + 1;
    await req.user.save();
    clearCookie(res);
    res.json({ message: 'Logged out and active sessions invalidated' });
});
export const get_me = (req, res) => res.json({ user: clean(req.user) });
export const post_forgot_password = wrap(async (req, res) => {
    const d = parse(z.object({ email }), req.body);
    const user = await User.findOne({ email: d.email, role: 'customer' }).select('+resetTokenHash');
    if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        user.resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        user.resetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        const url = `${(process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0]}/reset-password?token=${token}`;
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
            try {
                await transport.sendMail({ from: process.env.SMTP_FROM || 'Dakshayani <noreply@example.com>', to: user.email, subject: 'Reset your Dakshayani password', text: `Reset your password within 30 minutes: ${url}` });
            }
            catch (e) {
                console.error('Password reset mail failed:', e.message);
            }
        }
        else if (process.env.NODE_ENV !== 'production')
            console.info('[DEV ONLY] Password reset link:', url);
    }
    res.json({ message: 'If the email exists, password reset instructions will be sent.' });
});
export const post_reset_password = wrap(async (req, res) => {
    const d = parse(z.object({ token: z.string().length(64), password }), req.body);
    const hash = crypto.createHash('sha256').update(d.token).digest('hex');
    const user = await User.findOne({ resetTokenHash: hash, resetExpiresAt: { $gt: new Date() } }).select('+resetTokenHash');
    if (!user)
        throw httpError(400, 'Reset link is invalid or expired');
    user.passwordHash = await bcrypt.hash(d.password, 12);
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    user.resetTokenHash = undefined;
    user.resetExpiresAt = undefined;
    await user.save();
    clearCookie(res);
    res.json({ message: 'Password changed. Please log in.' });
});
