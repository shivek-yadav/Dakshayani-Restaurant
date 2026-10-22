import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const Testimonial = model('Testimonial', new Schema({ name: { type: String, required: true }, quote: { type: String, required: true }, rating: { type: Number, min: 1, max: 5, default: 5 }, published: { type: Boolean, default: false } }, config));
