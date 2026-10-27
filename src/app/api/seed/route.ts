import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/store';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: `Database successfully reseeded with ${result.count} premium aquarium products.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
