import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/store';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items || !body.shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Items and shipping address are required' },
        { status: 400 }
      );
    }

    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
