import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const bestSeller = searchParams.get('bestSeller') === 'true';
    const specialDeal = searchParams.get('specialDeal') === 'true';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = searchParams.get('sort') || undefined;

    const products = await getProducts({
      category,
      search,
      featured,
      bestSeller,
      specialDeal,
      minPrice,
      maxPrice,
      sort,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    const created = await createProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
