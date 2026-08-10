// File: app/api/products/route.ts
// Description: API endpoint to fetch all products or create a new product in MongoDB.
// Inputs: HTTP GET requests (no input) or POST requests with product JSON payload.
// Processing: Connects to MongoDB via Mongoose and queries or saves documents to the products collection.
// Outputs: JSON response containing the product list or success message.

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Products';

// GET: Fetch all products for the storefront catalog
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST: Add a new product to the catalog (Admin action)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}