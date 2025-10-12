import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

// Public create endpoint used after successful payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, date, time, name, email, phone = '', notes = '' } = body || {};

    if (!serviceId || !date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date,
        time,
        name,
        email,
        phone,
        notes,
        status: 'booked',
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
