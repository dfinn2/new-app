// lib/db/documents.ts
import { createClient } from "@/utils/supabase/server";

export async function getUserDocuments(userId: string) {
  if (!userId) return [];
  
  try {
    const supabase = await createClient();
    
    // Fetch user's documents from user_purchases table with joined document details
    const { data, error } = await supabase
      .from('user_purchases')
      .select(`
        id,
        purchase_date,
        status,
        amount,
        product_name,
        document_type,
        disclosing_party,
        receiving_party,
        expiry_date,
        signed_date
      `)
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error with Supabase client:', error);
    return [];
  }
}

export async function getDocumentById(documentId: string, userId: string) {
  if (!documentId || !userId) return null;
  
  try {
    const supabase = await createClient();
    
    // Fetch specific document details
    const { data, error } = await supabase
      .from('user_purchases')
      .select(`
        id,
        purchase_date,
        status,
        amount,
        product_name,
        document_type,
        content,
        disclosing_party,
        receiving_party,
        expiry_date,
        signed_date,
        file_path
      `)
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();
    
      console.log("Document data:", data);
    if (error) {
      console.error('Error fetching document by id:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error with Supabase client:', error);
    return null;
  }
}