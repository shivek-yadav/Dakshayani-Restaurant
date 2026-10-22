
import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const config = { timestamps: true };

// Schema for individual order items
const lineSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [lineSchema],
      required: true
    },
    fulfillment: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup'
    },
    address: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      pincode: String
    },
    notes: {
      type: String,
      default: ''
    },
    subtotal: Number,
    deliveryFee: Number,
    total: Number,
    paymentMethod: {
      type: String,
      enum: ['pay_on_pickup', 'cash_on_delivery'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid'
    },
    status: {
      type: String,
      enum: [
        'placed',
        'accepted',
        'preparing',
        'ready',
        'completed',
        'rejected',
        'cancelled'
      ],
      default: 'placed'
    },
    statusHistory: [
      {
        status: String,
        at: Date,
        by: String
      }
    ]
  },
  config
);

export const Order = model('Order', orderSchema);
