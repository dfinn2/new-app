import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  // Get session ID from URL query parameter
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }
  
  try {
    // Retrieve complete session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'line_items.data.price.product', 'customer']
    });
    
    // Format the data you want to return to the client
    const orderData = {
      status: session.payment_status,
      customer: {
        email: session.customer_details?.email,
        name: session.customer_details?.name,
      },
      shipping: session.shipping_details,
      items: session.line_items?.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total / 100, // Convert from cents
      })),
      payment: {
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        paymentMethod: session.payment_method_types?.[0],
        created: new Date(session.created * 1000).toISOString(),
      },
      receiptId: session.payment_intent && typeof session.payment_intent === 'object' ? session.payment_intent.id : sessionId,
    };
    
    return NextResponse.json(orderData);
  } catch (error: unknown) {
    console.error('Error retrieving session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error retrieving session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}