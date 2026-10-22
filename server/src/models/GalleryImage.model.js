import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const GalleryImage = model('GalleryImage', new Schema({ title: String, category: { type: String, default: 'Ambience' }, url: { type: String, required: true }, imageFileId: String, sortOrder: { type: Number, default: 0 }, published: { type: Boolean, default: true } }, config));
