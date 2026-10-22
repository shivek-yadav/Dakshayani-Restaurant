import { ActivityLog } from '../models/index.js';
/** Audit operations are deliberately non-blocking. */
export const log = async (req, action, entity, entityId, details = '') => {
    await ActivityLog.create({ actor: req.user._id, action, entity, entityId: String(entityId || ''), details }).catch(e => console.error('Audit log error', e.message));
};
