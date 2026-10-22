import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const FAQ = model('FAQ', new Schema({ question: { type: String, required: true }, answer: { type: String, required: true }, sortOrder: { type: Number, default: 0 }, published: { type: Boolean, default: true } }, config));
