import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const config = { timestamps: true };
export const Inquiry = model('Inquiry', new Schema({ name: { type: String, required: true }, email: { type: String, required: true }, phone: String, subject: String, message: { type: String, required: true }, status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' }, adminNote: String }, config));
