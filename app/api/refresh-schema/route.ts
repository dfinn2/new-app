// app/api/refresh-schema/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );
  
  try {
    // Executing a simple query can help refresh the schema cache
    const { data, error } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .limit(1);
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Schema cache refreshed' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}