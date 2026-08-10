// File: models/Product.ts
// Description: Defines the TypeScript interface and Mongoose schema for e-commerce store products.
// Inputs: Product name, description, price, category, gender, size, stock count, and image URL.
// Processing: Indexes name, category, and gender fields to optimize rapid database queries.
// Outputs: Mongoose Product model with type safety.

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  size?: string;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    gender: { type: String, required: true, default: 'Unisex', index: true },
    size: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;