// For App Router: /app/api/get-products/route.js

import Stripe from 'stripe';

// App Router handler
export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const prices = await stripe.prices.search({
      query: 'active:\'true\'',
      expand: ['data.product'] // Important to expand the product details
    });

    // Format the response data
    const products = prices.data.map(price => ({
      id: price.id,
      name: price.product.name,
      unit_amount: price.unit_amount,
      currency: price.currency,
      product: price.product,
      
      // Include any other needed fields
    }));

    // Return the response
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
