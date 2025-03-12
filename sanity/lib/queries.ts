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


// export const STARTUP_BY_ID_QUERY = 
//    defineQuery(`*[_type == "startup"  && _id == $id][0]{
//  _id, 
//  title, 
//  slug,
//  _createdAt,
 // "author": author -> {
//    "_id": _id, 
//    "name": name, 
//    "image": image, 
//    "bio": bio
//  }, 
//  views, 
//  description, 
//  category,
//  image
//}`)

export const PRODUCT_QUERY =
    defineQuery(`*[_type == "product"]{
      name,
      description,
      details, 
      _id,
      productId,
      slug,
      basePrice
  }`);