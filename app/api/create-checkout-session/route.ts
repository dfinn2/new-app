// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Creating checkout session with data:", body);
    
    const { 
      productId, 
      productName, 
      price, 
      description, 
      stripePriceId, 
      stripeProductId,
      slug,
      email,
      formData,
      userId // Check if userId is directly provided
    } = body;
    
    // If userId isn't provided directly, try to get the user from the auth session
    let userIdToUse = userId;
    
    if (!userIdToUse) {
      // Get auth cookie from the request - fixed with await
      const cookieStore = await cookies();
      
      // Check for various Supabase cookie names
      const sbAccessToken = cookieStore.get('sb-access-token');
      const sbRefreshToken = cookieStore.get('sb-refresh-token');
      const supabaseAuthToken = cookieStore.get('supabase-auth-token');
      
      const supabaseAuthCookie = sbAccessToken?.value || sbRefreshToken?.value || supabaseAuthToken?.value;
      
      console.log("Supabase auth cookie found:", !!supabaseAuthCookie);
      
      if (supabaseAuthCookie) {
        try {
          // Get user from cookie
          const { data: { user }, error } = await supabase.auth.getUser(supabaseAuthCookie);
          
          if (user && !error) {
            userIdToUse = user.id;
            console.log("Got userId from auth cookie:", userIdToUse);
          } else {
            console.log("Error getting user from auth cookie:", error);
          }
        } catch (authError) {
          console.error("Error parsing auth cookie:", authError);
        }
      }
    }

    // Try auth header approach as fallback
    if (!userIdToUse) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            userIdToUse = user.id;
            console.log("Got userId from auth header:", userIdToUse);
          }
        } catch (authError) {
          console.error("Error parsing auth header:", authError);
        }
      }
    }

    // Try email lookup as last resort
    if (!userIdToUse && email) {
      console.log("Looking up user by email:", email);
      
      // Look up in user_profiles without using admin API
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .ilike('email', email.trim())
          .maybeSingle();
          
        if (profile) {
          userIdToUse = profile.id;
          console.log("Found user in user_profiles by email:", userIdToUse);
        } else {
          console.log("User not found in user_profiles by email");
        }
      } catch (profileError) {
        console.error("Error looking up user profile:", profileError);
      }
    }
    
    // Extract relevant data from formData for metadata
    let metadata: Record<string, string> = {
      productId: productId || '',
      productName: productName || '',
    };
    
    // Add userId to metadata if available
    if (userIdToUse) {
      metadata.userId = userIdToUse;
      console.log("Added userId to checkout metadata:", userIdToUse);
    } else {
      console.warn("No userId available for checkout session! Order tracking will fail.");
      
      // For guest checkout: Just store the email in metadata
      if (email) {
        metadata.userEmail = email;
        console.log("Added userEmail to metadata for guest checkout:", email);
      }
    }
    
    // Add form data to metadata if available
    if (formData) {
      // Add specific fields we need for the purchase record
      metadata.documentType = productName || 'Legal Document';
      
      if (formData.disclosingPartyName) {
        metadata.disclosingParty = formData.disclosingPartyName;
      }
      
      if (formData.receivingPartyName) {
        metadata.receivingParty = formData.receivingPartyName;
      }
    }
    
    // Create session parameters
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product/${slug || productId}`,
      metadata: metadata,
    };
    
    // Add customer email if provided
    if (email) {
      params.customer_email = email;
    }
    
    // If stripePriceId exists, use it directly
    if (stripePriceId) {
      params.line_items = [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ];
    }
    // If stripeProductId exists, find its first price
    else if (stripeProductId) {
      // Get the first active price for this product
      const prices = await stripe.prices.list({
        product: stripeProductId,
        active: true,
        limit: 1,
      });
      
      if (prices.data.length === 0) {
        return NextResponse.json(
          { error: "No active price found for this product" },
          { status: 400 }
        );
      }
      
      params.line_items = [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ];
    }
    // Otherwise create a product and price on the fly
    else {
      params.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: description || undefined,
              metadata: {
                product_id: productId,
              },
            },
            unit_amount: price, // Price should be in cents
          },
          quantity: 1,
        },
      ];
    }
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create(params);
    console.log("Session created with metadata:", session.metadata);
    
    // Return the session ID and URL
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error: unknown) {
    // Detailed error logging
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}