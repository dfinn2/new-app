import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = 
   defineQuery(`*[_type == "startup"  && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search || description match $search]{
  _id, 
  title, 
  slug,
  _createdAt,
  "author": author -> {
    "_id": _id, 
    "name": name, 
    "image": image, 
    "bio": bio
  }, 
  views, 
  description, 
  category,
  image
}`);

export const PRODUCT_QUERY =
    defineQuery(`*[_type == "product"]{
      name,
      description,
      details, 
      _id,
      productId,
      "slug": slug.current,
      basePrice,
      stripeProductId,
      stripePriceId
  }`);

export const PRODUCT_PAGE_QUERY = 
   defineQuery(`*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      description,
      "slug": slug.current,
      "image": mainImage.asset->url,
      basePrice,
      content,
      stripeProductId,
      stripePriceId
   }`);