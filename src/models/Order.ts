import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderDocument extends Document {
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'demo' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    orderStatus: {
      type: String,
      enum: ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    trackingNumber: String,
  },
  { timestamps: true }
);

export const OrderModel =
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
