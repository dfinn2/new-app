// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Process the successful payment
    const supabase = await createClient();
    const userId = session.metadata?.userId;
    const templateId = session.metadata?.templateId;
    const purchaseId = session.metadata?.purchaseId;
    
    if (purchaseId) {
      // Update the existing purchase record
      await supabase
        .from('document_purchases')
        .update({ 
          payment_status: 'paid',
          stripe_payment_id: session.payment_intent as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', purchaseId);
    } else if (userId && templateId) {
      // Create a new purchase record
      await supabase
        .from('document_purchases')
        .insert({ 
          user_id: userId,
          template_id: templateId,
          stripe_payment_id: session.payment_intent as string,
          payment_status: 'paid',
          generations_used: 0
        });
    }
  }
  
  return NextResponse.json({ received: true });
}