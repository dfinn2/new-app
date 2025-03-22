// app/api/documents/[id]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getDocumentById, getDocumentData } from '@/lib/db/userDocuments';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the document ID from the route params
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    // Get the Supabase client
    const supabase = await createClient();
    
    // Get authenticated user using Supabase directly
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // If not authenticated, return 401
    if (!user || error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Get the document
    const document = await getDocumentById(id, userId);
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Get the document data
    const documentData = await getDocumentData(id);
    
    if (!documentData || !documentData.document_content) {
      return NextResponse.json(
        { error: 'Document content not found' },
        { status: 404 }
      );
    }
    
    // Generate filename
    const cleanName = (document.product_name || 'document')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    
    const filename = `${cleanName}_${id.substring(0, 8)}.pdf`;
    
    // Return the PDF document with appropriate headers
    return new NextResponse(
      Buffer.from(documentData.document_content, 'base64'),
      {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      }
    );
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}