import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', bookingDetails, orderDetails } = await request.json();

    // Determine if this is a booking or shop order
    const isBooking = !!bookingDetails;
    const isShopOrder = !!orderDetails;

    let metadata: Record<string, string> = {};

    if (isBooking) {
      // Booking appointment metadata
      metadata = {
        type: 'booking',
        service: bookingDetails.service || '',
        date: bookingDetails.date || '',
        time: bookingDetails.time || '',
        customerName: bookingDetails.name || '',
        customerEmail: bookingDetails.email || '',
      };
    } else if (isShopOrder) {
      // Shop order metadata
      const itemNames = orderDetails.items?.map((item: any) => item.name).join(', ') || '';
      const itemQuantities = orderDetails.items?.map((item: any) => `${item.name}: ${item.quantity}`).join(', ') || '';
      
      metadata = {
        type: 'shop_order',
        items: itemNames.substring(0, 500), // Stripe metadata has 500 char limit
        quantities: itemQuantities.substring(0, 500),
        customerName: orderDetails.customer?.name || '',
        customerEmail: orderDetails.customer?.email || '',
        customerPhone: orderDetails.customer?.phone || '',
        shippingAddress: `${orderDetails.customer?.address || ''}, ${orderDetails.customer?.city || ''}, ${orderDetails.customer?.postalCode || ''}`.substring(0, 500),
        subtotal: orderDetails.subtotal?.toString() || '',
        shipping: orderDetails.shipping?.toString() || '',
      };
    } else {
      throw new Error('Either bookingDetails or orderDetails must be provided');
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
