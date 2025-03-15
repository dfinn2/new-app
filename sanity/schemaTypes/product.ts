import { defineField, defineType } from "sanity";
import { Box } from "lucide-react";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: Box,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "stripeProductId",
      title: "Stripe Product ID",
      type: "string",
      
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe Price ID",
      type: "string",
      
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "basePrice",
      title: "Base Price in cents",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "details",
      title: "Full Product Description",
      type: "markdown",
    }),

    defineField({
      name: "addOns",
      title: "Add-ons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "addOnid",
              title: "AddOn ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "addOnName",
              title: "AddOn Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "addOnDescription",
              title: "AddOnDescription",
              type: "markdown",
            },
            {
              name: "addOnPrice",
              title: "Price in cents",
              type: "number",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "stripeProductId",
              title: "Stripe Product ID",
              type: "string",
              
            },
            {
              name: "stripePriceId",
              title: "Stripe Price ID",
              type: "string",
            },
        ],
    }],
    }),
]});
