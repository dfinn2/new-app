// app/api/document-generations/[id]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const generationId = params.id;
    
    // Get the generation record
    const supabase = await createClient();
    const { data: generation, error: generationError } = await supabase
      .from('document_generations')
      .select(`
        id,
        file_path,
        purchase_id,
        document_purchases!inner(
          user_id,
          template_id,
          document_templates!inner(name)
        )
      `)
      .eq('id', generationId)
      .single();
    
    if (generationError || !generation) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Verify the document belongs to the user
    if (generation.document_purchases.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get the file from storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(generation.file_path);
    
    if (fileError) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Generate filename
    const templateName = generation.document_purchases.document_templates.name.replace(/\s+/g, '_');
    const filename = `${templateName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Return the file
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}