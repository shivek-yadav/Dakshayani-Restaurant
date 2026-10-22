import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
const userSchema = new Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, phone: { type: String, default: '' }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ['customer', 'admin'], default: 'customer' }, status: { type: String, enum: ['active', 'blocked'], default: 'active' }, resetTokenHash: { type: String, select: false }, resetExpiresAt: Date, lastLogin: Date, sessionVersion: { type: Number, default: 0 } }, config);
export const User = model('User', userSchema);
