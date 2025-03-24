// app/api/save-document/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: NextRequest) {
  console.log('📝 Save-document API called');
  
  try {
    const body = await req.json();
    console.log('Request body received:', body);
    
    const { 
      userId, 
      filename, 
      fileUrl, 
      sessionId, 
      documentType,
      status, 
      createdAt 
    } = body;
    
    if (!userId || !filename || !fileUrl || !documentType) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    console.log('🔌 Supabase client initialized');
    
    // First, verify the user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    console.log('Auth check result:', userError ? 'User not found' : 'User found', userError ? userError : 'No error');
    
    if (userError) {
      return NextResponse.json(
        { error: 'User not found or unauthorized' },
        { status: 401 }
      );
    }
    
    // If we have a session ID, find the associated order
    let orderItemId = null;
    
    if (sessionId) {
      // Find the order with this checkout session
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_checkout_session_id', sessionId)
        .single();
      
      if (order) {
        // Find the order item for this document type
        const { data: orderItems } = await supabaseAdmin
          .from('order_items')
          .select('id, template_id, generations_remaining')
          .eq('order_id', order.id)
          .eq('generations_remaining', '>', 0);
        
        if (orderItems && orderItems.length > 0) {
          // Get the first order item with remaining generations
          // Ideally you'd match by document type to template id here
          orderItemId = orderItems[0].id;
          
          // Decrement the generations_remaining count
          await supabaseAdmin
            .from('order_items')
            .update({ 
              generations_remaining: orderItems[0].generations_remaining - 1 
            })
            .eq('id', orderItemId);
        }
      }
    }
    
    // Prepare document record
    const documentRecord = {
      user_id: userId,
      title: filename,
      file_path: fileUrl,
      document_type: documentType,
      order_item_id: orderItemId,
      status: status || 'completed',
      created_at: createdAt || new Date().toISOString()
    };
    
    console.log('📄 Attempting to insert document record:', documentRecord);
    
    // Insert into user_generations table
    const { data, error } = await supabaseAdmin
      .from('user_generations')
      .insert([documentRecord])
      .select();
    
    if (error) {
      console.log('❌ Database error inserting document:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error details:', error.details);
      
      return NextResponse.json(
        { 
          error: 'Failed to save document record',
          details: error.message
        }, 
        { status: 500 }
      );
    }
    
    console.log('✅ Document record saved successfully:', data);
    
    return NextResponse.json({ 
      success: true, 
      documentId: data?.[0]?.id,
      message: 'Document saved successfully' 
    });
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}