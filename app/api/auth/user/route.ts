'use server';

import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/dal';

export async function GET() {
  const { user } = await verifySession();
  
  if (!user) {
    return NextResponse.json({ user: null });
  }
  
  return NextResponse.json({ user });
}

