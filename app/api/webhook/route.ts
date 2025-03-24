// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Initialize Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: NextRequest) {
  console.log('Webhook received');
  
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;
    
    // Debug: Log what we received
    console.log(`Request body (first 100 chars): ${body.substring(0, 100)}...`);
    
    // Parse the event
    let event: Stripe.Event;
    
    try {
      // Try to use the webhook secret if available
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
      
      if (webhookSecret && signature) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // For testing without signature verification
        console.log('No webhook secret or signature, parsing body directly');
        event = JSON.parse(body);
      }
    } catch (err: any) {
      console.error(`⚠️ Webhook error: ${err.message}`);
      return NextResponse.json(
        { error: { message: err.message } },
        { status: 400 }
      );
    }
    
    console.log(`Event received: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Debug: Log the entire metadata
      console.log('Session metadata:', session.metadata);
      
      try {
        // Extract user ID from metadata
        if (!session.metadata?.userId) {
          console.error('No userId found in session metadata');
          return NextResponse.json({ received: true }, { status: 200 });
        }

        const userId = session.metadata.userId;
        
        // Debug: Log the user ID we found
        console.log(`Using userId: ${userId}`);
        
        // Check if we've already processed this session (idempotency)
        const { data: existingOrder } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('stripe_checkout_session_id', session.id)
          .maybeSingle();
          
        if (existingOrder) {
          console.log(`Order for session ${session.id} already exists (id: ${existingOrder.id})`);
          return NextResponse.json({ received: true }, { status: 200 });
        }
        
        // Create order record
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_checkout_session_id: session.id,
            status: 'completed',
            total_amount: session.amount_total,
            currency: session.currency,
            country: session.customer_details?.address?.country || 'unknown',
            created_at: new Date().toISOString(),
                      
            })
          .select()
          .single();
        
        if (orderError) {
          console.error(`Error creating order: ${JSON.stringify(orderError)}`);
          return NextResponse.json({ received: true }, { status: 200 });
        }
        
        console.log(`✅ Order created: ${order.id}`);
        
        
        // Create order item 
        // If you have templateId in metadata, use it
        const templateId = session.metadata.productId;
        
        if (templateId) {
          console.log(`Looking up product with ID: ${templateId}`);
          
          // Get template information if needed
          const { data: template } = await supabaseAdmin
            .from('product_db')
            .select('id')
            .eq('id', templateId)
            .single();
          
          if (template) {
            // Create the order item
            const { error: itemError } = await supabaseAdmin
              .from('order_items')
              .insert({
                order_id: order.id,
                template_id: template.id,
                template_price_id: null, // You may want to look this up based on the price
                amount_paid: session.amount_total,
                currency: session.currency,
                generations_purchased: 3, // Default value
                generations_remaining: 3, // Default value
              });
            
            if (itemError) {
              console.error(`Error creating order item: ${JSON.stringify(itemError)}`);
            } else {
              console.log(`✅ Order item created for template: ${template.id}`);
            }
          }
        } else {
          console.log('No templateId found in metadata, skipping order item creation');
        }
      } catch (error: any) {
        console.error(`Error processing checkout session: ${error.message}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}