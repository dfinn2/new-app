// lib/db/userDocuments.ts
import { createClient } from "@/utils/supabase/server";
import { stripe } from "../stripe";

export interface UserDocument {
  id: string;
  purchase_date: string;
  status: string;
  amount?: number;
  product_name: string;
  document_type: string;
  file_path?: string;
  disclosing_party?: string;
  receiving_party?: string;
  expiry_date?: string;
  signed_date?: string;
  created_at: string;
  updated_at?: string;
  stripe_session_id?: string;
  user_id: string;
}

export interface DocumentData {
  id: string;
  purchase_id: string;
  form_data: Record<string, any>;
  document_content?: string; // Base64 encoded PDF
  created_at: string;
  email_sent: boolean;
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string): Promise<UserDocument[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  const supabase = await createClient();
  
  try {
    // Get all user purchases/documents
    const { data, error } = await supabase
      .from('document_purchases')
      .select(`
        id,
        purchase_date,
        status,
        amount,
        product_name,
        document_type,
        file_path,
        disclosing_party,
        receiving_party,
        expiry_date,
        signed_date,
        created_at,
        updated_at,
        stripe_session_id,
        user_id
      `)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching user documents:", error);
      throw new Error(`Failed to fetch user documents: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    throw error;
  }
}

/**
 * Get a single document by ID
 */
export async function getDocumentById(documentId: string, userId: string): Promise<UserDocument | null> {
  if (!documentId || !userId) {
    throw new Error("Document ID and User ID are required");
  }
  
  const supabase = await createClient();
  
  try {
    // Get the document/purchase record
    const { data, error } = await supabase
      .from('document_purchases')
      .select(`
        id,
        user_id,
        stripe_payment_id,
        payment_status,
        generations_used,
        product_name,
        stripe_session_id,
        created_at,
        updated_at,
        documents:document_templates (
          name,
          base_price,
          description,
          file_path,)`)
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching document:", error);
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getDocumentById:", error);
    throw error;
  }
}

/**
 * Get document data by purchase ID
 */
export async function getDocumentData(purchaseId: string): Promise<DocumentData | null> {
  if (!purchaseId) {
    throw new Error("Purchase ID is required");
  }
  
  const supabase = await createClient();
  
  try {
    // Get the document data
    const { data, error } = await supabase
      .from('document_data')
      .select(`
        id,
        purchase_id,
        form_data,
        document_content,
        created_at,
        email_sent
      `)
      .eq('purchase_id', purchaseId)
      .single();
    
    if (error) {
      console.error("Error fetching document data:", error);
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch document data: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getDocumentData:", error);
    throw error;
  }
}

/**
 * Download document as a PDF
 */
export async function downloadDocument(documentId: string, userId: string): Promise<{
  content: string;
  filename: string;
  contentType: string;
} | null> {
  try {
    // First get the document metadata
    const document = await getDocumentById(documentId, userId);
    if (!document) {
      throw new Error("Document not found");
    }
    
    // Then get the document data with the PDF content
    const documentData = await getDocumentData(documentId);
    if (!documentData || !documentData.document_content) {
      throw new Error("Document content not found");
    }
    
    // Generate a filename
    const cleanName = (document.product_name || 'document')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    
    const filename = `${cleanName}_${documentId.substring(0, 8)}.pdf`;
    
    return {
      content: documentData.document_content,
      filename,
      contentType: 'application/pdf'
    };
  } catch (error) {
    console.error("Error downloading document:", error);
    throw error;
  }
}

/**
 * Re-generate and email a document to the user
 */
export async function resendDocumentEmail(documentId: string, userId: string, email: string): Promise<boolean> {
  try {
    // First get the document data
    const document = await getDocumentById(documentId, userId);
    if (!document) {
      throw new Error("Document not found");
    }
    
    const documentData = await getDocumentData(documentId);
    if (!documentData || !documentData.document_content) {
      throw new Error("Document content not found");
    }
    
    // Generate a filename
    const cleanName = (document.product_name || 'document')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    
    const filename = `${cleanName}_${documentId.substring(0, 8)}.pdf`;
    
    // Here you'd add your email sending logic
    // For example, you could call an API route that sends emails
    const response = await fetch('/api/resend-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        documentId,
        documentName: document.product_name,
        documentType: document.document_type,
        pdfData: documentData.document_content,
        filename
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to send email");
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error resending document email:", error);
    throw error;
  }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(documentId: string, userId: string, status: string): Promise<boolean> {
  if (!documentId || !userId || !status) {
    throw new Error("Document ID, User ID, and Status are required");
  }
  
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('document_purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', documentId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error updating document status:", error);
      throw new Error(`Failed to update document status: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateDocumentStatus:", error);
    throw error;
  }
}

/**
 * List all documents for admin view
 */
export async function listAllDocuments(limit = 100, offset = 0): Promise<UserDocument[]> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('document')
      .select(`
        id,
        purchase_date,
        status,
        amount,
        product_name,
        document_type,
        file_path,
        disclosing_party,
        receiving_party,
        expiry_date,
        signed_date,
        created_at,
        updated_at,
        stripe_session_id,
        user_id
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error("Error listing all documents:", error);
      throw new Error(`Failed to list documents: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in listAllDocuments:", error);
    throw error;
  }
}

/**
 * Count user documents
 */
export async function countUserDocuments(userId: string): Promise<number> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  const supabase = await createClient();
  
  try {
    const { count, error } = await supabase
      .from('document_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error counting user documents:", error);
      throw new Error(`Failed to count documents: ${error.message}`);
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in countUserDocuments:", error);
    throw error;
  }
}

/**
 * Search user documents
 */
export async function searchUserDocuments(
  userId: string, 
  query: string,
  limit = 20
): Promise<UserDocument[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  const supabase = await createClient();
  
  try {
    // Search across multiple columns
    const { data, error } = await supabase
      .from('document_purchases')
      .select(`
        id,
        purchase_date,
        status,
        amount,
        product_name,
        document_type,
        file_path,
        disclosing_party,
        receiving_party,
        expiry_date,
        signed_date,
        created_at,
        updated_at,
        stripe_session_id,
        user_id
      `)
      .eq('user_id', userId)
      .or(`product_name.ilike.%${query}%,document_type.ilike.%${query}%,disclosing_party.ilike.%${query}%,receiving_party.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error searching user documents:", error);
      throw new Error(`Failed to search documents: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in searchUserDocuments:", error);
    throw error;
  }
}

/**
 * Create a new empty document (placeholder for future use)
 */
export async function createEmptyDocument(
  userId: string,
  productName: string,
  documentType: string
): Promise<string> {
  if (!userId || !productName || !documentType) {
    throw new Error("User ID, Product Name, and Document Type are required");
  }
  
  const supabase = await createClient();
  
  try {
    // Create a new purchase/document record
    const { data, error } = await supabase
      .from('document_purchases')
      .insert({
        user_id: userId,
        created_at: new Date(),
        stripe_payment_id: null,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Error creating empty document:", error);
      throw new Error(`Failed to create document: ${error.message}`);
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in createEmptyDocument:", error);
    throw error;
  }
}