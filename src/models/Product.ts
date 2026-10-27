import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  scientificName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  images: string[];
  description: string;
  shortDescription?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isSpecialDeal: boolean;
  isLiveStock: boolean;
  careLevel?: string;
  temperament?: string;
  waterParameters?: {
    temperature?: string;
    ph?: string;
    hardness?: string;
    minTankSize?: string;
  };
  dimensions?: string;
  specifications?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    scientificName: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    inStock: { type: Boolean, default: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    shortDescription: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isSpecialDeal: { type: Boolean, default: false },
    isLiveStock: { type: Boolean, default: false },
    careLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] },
    temperament: { type: String, enum: ['Peaceful', 'Semi-Aggressive', 'Aggressive'] },
    waterParameters: {
      temperature: String,
      ph: String,
      hardness: String,
      minTankSize: String,
    },
    dimensions: String,
    specifications: { type: Map, of: String },
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
