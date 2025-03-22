// lib/db/documents.ts
import { createClient } from "@/utils/supabase/server";
import { ProductTypeCard } from "@/components/ProductCard";
import { Json } from "./types";

export interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  description: string;
  file_path: string;
  form_schema: Json;
  active: boolean;
  stripe_product_id: string;
  stripe_price_id: string;
  created_at: string;
  updated_at: string;
  empty_3: string;
}

// Fetch all products from the database
export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("document_templates")
      .select(
        "id, name, slug, base_price, description, file_path, form_schema, active, stripe_product_id, stripe_price_id, created_at, updated_at, empty_3"
      )
      .order("name", { ascending: true });
  
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error with Supabase client:", error);
    return [];
  }
}

// Fetch specific product by slug

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("document_templates")
      .select(
        "id, name, slug, base_price, description, file_path, form_schema, active, stripe_product_id, stripe_price_id, created_at, updated_at"
      )
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching product by slug:", error);
      return null;
    }

    return data || null;
  }
  catch (error) {
    console.error("Error with Supabase client:", error);
    return null;
  }
}



// Fetch all products from the database
export async function getProducts(
  searchQuery?: string | null
): Promise<ProductTypeCard[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("document_templates")
      .select(
        "id, name, description, base_price, stripe_product_id, stripe_price_id, active"
      );

    // Only return active products
    query = query.eq("active", true);

    // If search query is provided, filter results
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    // Return data directly without transformation
    // ProductTypeCard now matches Supabase structure
    return data || [];
  } catch (error) {
    console.error("Error with Supabase client:", error);
    return [];
  }
}

export async function getUserDocuments(userId: string) {
  if (!userId) return [];

  try {
    const supabase = await createClient();

    // Fetch user's documents from document_purchases table with joined document details
    const { data, error } = await supabase
      .from("document_purchases")
      .select(
        `
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
      `
      )
      .eq("user_id", userId)
      .order("purchase_date", { ascending: false });

    if (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error with Supabase client:", error);
    return [];
  }
}

// Fetch specific document details
export async function getDocumentById(documentId: string, userId: string) {
  if (!documentId || !userId) return null;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("document_purchases")
      .select(
        `
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
      `
      )
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    console.log("Document data:", data);
    if (error) {
      console.error("Error fetching document by id:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error with Supabase client:", error);
    return null;
  }
}

/**
 * Saves a document record to the database
 */
export async function saveDocumentRecord(
  userId: string,
  documentData: {
    title: string,
    filePath: string,
    documentType: string,
    purchaseId?: string
  }
) {
  if (!userId || !documentData) return null;
  
  try {
    const supabase = createClient();
    
    // Save document record to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: documentData.title,
        file_path: documentData.filePath,
        document_type: documentData.documentType,
        status: 'completed',
        purchase_id: documentData.purchaseId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving document record:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error with Supabase client:', error);
    return null;
  }
}