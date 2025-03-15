export interface SanityProduct {
  _id: string;
  name?: string;
  category?: string;
  description?: string;
  slug?: {
    current: string;
    type?: string;
  };
  basePrice?: number;
  price?: number;
}