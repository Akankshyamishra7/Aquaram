import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Please provide a coupon code' },
        { status: 400 }
      );
    }

    const result = validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json({ success: result.valid, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error checking coupon' },
      { status: 500 }
    );
  }
}
