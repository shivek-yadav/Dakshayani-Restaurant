import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const Category = model('Category', new Schema({ name: { type: String, required: true }, slug: { type: String, unique: true, required: true }, description: { type: String, default: '' }, image: { type: String, default: '' }, sortOrder: { type: Number, default: 0 }, published: { type: Boolean, default: true } }, config));
