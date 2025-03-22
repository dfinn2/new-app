// lib/db/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// User Profile
export interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  created_at: string;
  is_admin: boolean;
}

// Document Template
export interface Document {
  id: string;
  title: string;
  description: string | null;
  base_price: number;
  category: string | null;
  code: string | null;
  created_at: string | null;
  duration: string | null;
  fields: Json[] | null;
  file_path: string | null;
  form_schema: Json | null;
  is_active: boolean | null;
  max_generations: number | null;
  required_uploads: Json[] | null;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  tempate_path: string | null; // Note: There's a typo in the original "tempate_path"
  template_html: string | null;
  thumbnail_url: string | null;
  updated_at: string | null;
}

// User's Document Instance
export interface UserDocument {
  id: string;
  user_id: string | null;
  document_id: string | null;
  purchase_id: string | null;
  file_path: string | null;
  form_data: Json | null;
  generation_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// Purchase Record
export interface UserPurchase {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: string;
  purchase_date: string | null;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Individual Item in a Purchase
export interface PurchaseItem {
  id: string;
  purchase_id: string;
  item_id: string;
  item_type: string;
  price_at_purchase: number;
  access_expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Document Upload
export interface DocumentUpload {
  id: string;
  user_id: string | null;
  user_document_id: string | null;
  temp_user_id: string | null;
  file_path: string;
  file_type: string;
  original_filename: string | null;
  created_at: string | null;
  expiry_date: string | null;
}

// User Document Access View
export interface UserDocumentAccess {
  user_id: string | null;
  document_id: string | null;
  purchase_id: string | null;
  purchase_item_id: string | null;
  title: string | null;
  description: string | null;
  file_path: string | null;
  is_active: boolean | null;
  price_at_purchase: number | null;
  purchase_date: string | null;
  access_expires_at: string | null;
}

// Working User Documents View
export interface WorkingUserDocument {
  user_id: string | null;
  document_id: string | null;
  purchase_id: string | null;
  purchase_item_id: string | null;
  title: string | null;
}

// User Accessible Items View
export interface UserAccessibleItem {
  user_id: string | null;
  item_id: string | null;
  item_type: string | null;
  item_name: string | null;
  item_description: string | null;
  file_path: string | null;
  is_active: boolean | null;
  access_expires_at: string | null;
}

// Insert and Update Types
export interface UserProfileInsert {
  id?: string;
  display_name?: string | null;
  email?: string | null;
  created_at?: string;
  is_admin?: boolean;
}

export interface UserProfileUpdate {
  display_name?: string | null;
  email?: string | null;
  is_admin?: boolean;
}

export interface DocumentInsert {
  id?: string;
  title: string;
  description?: string | null;
  base_price: number;
  category?: string | null;
  code?: string | null;
  created_at?: string | null;
  duration?: string | null;
  fields?: Json[] | null;
  file_path?: string | null;
  form_schema?: Json | null;
  is_active?: boolean | null;
  max_generations?: number | null;
  required_uploads?: Json[] | null;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
  tempate_path?: string | null;
  template_html?: string | null;
  thumbnail_url?: string | null;
  updated_at?: string | null;
}

export interface UserDocumentInsert {
  id?: string;
  user_id?: string | null;
  document_id?: string | null;
  purchase_id?: string | null;
  file_path?: string | null;
  form_data?: Json | null;
  generation_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserPurchaseInsert {
  id?: string;
  user_id?: string;
  total_amount: number;
  payment_status?: string;
  purchase_date?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_session_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Pagination and query parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DocumentQueryParams {
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserDocumentQueryParams {
  userId: string;
  documentId?: string;
}

export interface PurchaseQueryParams {
  userId: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}