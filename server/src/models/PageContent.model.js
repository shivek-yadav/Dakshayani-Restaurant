import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const PageContent = model('PageContent', new Schema({ slug: { type: String, required: true, unique: true }, title: String, subtitle: String, description: String, heroImage: String, body: String, published: { type: Boolean, default: true } }, config));
