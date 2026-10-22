import crypto from 'node:crypto';
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const httpError = (status, message) => Object.assign(new Error(message), { status });
export const uid = (prefix) => `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
export const slug = (str) => String(str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const validId = (id) => /^[a-f\d]{24}$/i.test(String(id));
export const pick = (obj, keys) => Object.fromEntries(keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]));
export const clean = (doc) => {
    const d = doc?.toObject?.() || doc;
    if (!d)
        return null;
    const { _id, __v, passwordHash, resetTokenHash, ...safe } = d;
    return { id: String(_id), ...safe };
};
export const ensure = (condition, status, message) => {
    if (!condition)
        throw httpError(status, message);
};
export const parse = (schema, data) => {
    const result = schema.safeParse(data);
    if (!result.success)
        throw httpError(400, result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '));
    return result.data;
};
