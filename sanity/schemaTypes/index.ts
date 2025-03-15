import { type SchemaTypeDefinition } from 'sanity'

import { author } from '@/sanity/schemaTypes/author';
import { startup } from '@/sanity/schemaTypes/startup';
import { product } from '@/sanity/schemaTypes/product';
import { blogpost } from '@/sanity/schemaTypes/blogpost';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, product, blogpost],
}
