import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const ActivityLog = model('ActivityLog', new Schema({ actor: { type: Schema.Types.ObjectId, ref: 'User' }, action: String, entity: String, entityId: String, details: String }, config));
