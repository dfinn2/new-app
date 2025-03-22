// lib/db/saveDocument.ts
import { createClient } from "@/utils/supabase/server";

/**
 * Uploads a generated PDF document to Supabase Storage
 * 
 * @param pdfBuffer - The PDF file buffer
 * @param filename - The name of the file
 * @param userId - The user ID who owns this document
 * @returns The file URL in Storage
 */
export async function uploadDocumentToStorage(
  pdfBuffer: Buffer, 
  filename: string, 
  userId: string
): Promise<string> {
  try {
    const supabase = await createClient();
    
    // Define file path in storage - organize by user ID
    const storagePath = `documents/${userId}/${filename}`;
    
    console.log(`Uploading document to ${storagePath}`);
    
    // Upload file to Storage bucket
    const { data, error } = await supabase
      .storage
      .from('documents') // Bucket name - make sure this exists in your Supabase project
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true // Overwrite if exists
      });
    
    if (error) {
      console.error('Error uploading document to storage:', error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(storagePath);
    
    console.log('Document uploaded successfully:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadDocumentToStorage:', error);
    throw error;
  }
}

/**
 * Saves document metadata to the database
 * 
 * @param params - Document parameters
 * @returns The document record ID
 */
interface SaveDocumentParams {
  userId: string;
  documentType: string;
  title: string;
  content?: string;
  filePath: string;
  formData: any;
}

export async function saveGeneratedDocument({
  userId,
  documentType,
  title,
  content,
  filePath,
  formData
}: SaveDocumentParams): Promise<string> {
  try {
    const supabase = await createClient();
    
    // Extract metadata based on document type
    const metadata: Record<string, any> = {};
    
    if (documentType === 'nnn-agreement') {
      metadata.disclosing_party = formData.disclosingPartyName;
      metadata.receiving_party = formData.receivingPartyName;
      metadata.product_name = formData.productName;
      
      // Calculate expiry date - For example, 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      metadata.expiry_date = expiryDate.toISOString();
    }
    
    // Insert record into document_purchases table and let Supabase generate the UUID
    const { data, error } = await supabase
      .from('document_purchases')
      .insert({
        user_id: userId,
        purchase_date: new Date().toISOString(),
        status: 'completed',
        product_name: title,
        document_type: documentType,
        file_path: filePath,
        content: content,
        ...metadata
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving document to database:', error);
      throw error;
    }
    
    // Get the generated ID from the returned data
    const docId = data?.id;
    console.log('Document saved successfully with ID:', docId);
    return docId || '';
  } catch (error) {
    console.error('Error in saveGeneratedDocument:', error);
    throw error;
  }
}