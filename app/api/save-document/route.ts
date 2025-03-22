// app/api/save-document/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  console.log("📝 Save-document API called");
  
  try {
    // Parse the request body with error handling
    let requestBody;
    try {
      requestBody = await request.json();
      console.log("Request body received:", JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error("❌ Error parsing request body:", parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const { userId, filename, fileUrl } = requestBody;
    
    if (!userId || !filename || !fileUrl) {
      console.error("❌ Missing required fields:", { userId, filename, fileUrl });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = await createClient();
    console.log("🔌 Supabase client initialized");
    
    // Check if user exists (optional validation)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("Auth check result:", userData ? "User found" : "User not found", userError ? `Error: ${userError.message}` : "No error");
      
      // We'll continue even if this check fails since the server might have different auth context
    } catch (authError) {
      console.error("⚠️ Auth check error (non-blocking):", authError);
      // Continue anyway - this is just an extra validation
    }
    
    // Simplify document data for insertion
    const documentData = {
      user_id: userId,
      title: filename,
      file_path: fileUrl,
      document_type: requestBody.documentType || 'document',
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    console.log("📄 Attempting to insert document record:", documentData);
    
    // Insert document record with detailed error logging
    try {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();
        
      if (docError) {
        console.error("❌ Database error inserting document:", docError);
        console.error("Error code:", docError.code);
        console.error("Error message:", docError.message);
        console.error("Error details:", docError.details);
        
        return NextResponse.json(
          { 
            success: false, 
            message: 'Database error', 
            error: docError.message,
            code: docError.code,
            details: docError.details
          },
          { status: 500 }
        );
      }
      
      console.log("✅ Document record created successfully:", docData);
      
      // Success response
      return NextResponse.json({
        success: true,
        documentId: docData.id,
        message: 'Document record saved successfully'
      });
      
    } catch (dbError) {
      console.error("❌ Unexpected database error:", dbError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unexpected database error', 
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("❌ Unhandled error in save-document API:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace available');
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}