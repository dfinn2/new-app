// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    // Verify webhook signature if secret is configured
    let event: Stripe.Event;
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      // For testing without a webhook secret
      event = JSON.parse(body) as Stripe.Event;
      console.warn('Webhook signature verification skipped - no webhook secret configured');
    }

    console.log(`Event received: ${event.type}`);

    // Handle successful checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Skip if session doesn't have necessary data
  if (!session.customer_details || session.payment_status !== 'paid') {
    console.log('Session missing required information or not paid');
    return;
  }

  try {
    // Get customer email from session
    const customerEmail = session.customer_details.email;
    if (!customerEmail) {
      console.log('No customer email available in the session');
      return;
    }

    // Get Supabase client
    const supabase = await createClient();
    
    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', customerEmail)
      .single();
    
    if (userError || !userData) {
      console.error('Error finding user:', userError);
      return;
    }
    
    const userId = userData.id;
    
    // Fetch line items to get product details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    if (!lineItems.data.length) {
      console.log('No line items found for session:', session.id);
      return;
    }
    
    // Get the first line item (assuming one document per purchase)
    const item = lineItems.data[0];
    
    // Get metadata from session
    const metadata = session.metadata || {};
    
    // Insert record into document_purchases table
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('document_purchases')
      .insert([
        {
          user_id: userId,
          purchase_date: new Date().toISOString(),
          product_name: item.description || 'Document Purchase',
          amount: session.amount_total || 0,
          status: 'completed',
          payment_status: 'paid',
          stripe_session_id: session.id,
          transaction_id: session.payment_intent as string,
          document_type: metadata.documentType || 'Legal Document',
          disclosing_party: metadata.disclosingParty || '',
          receiving_party: metadata.receivingParty || '',
        }
      ])
      .select();
    
    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
    } else {
      console.log('Purchase record created successfully:', purchaseData);
    }
  } catch (error) {
    console.error('Error handling checkout session completion:', error);
  }
}