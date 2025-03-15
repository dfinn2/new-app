import { defineField, defineType } from "sanity";
import { Notebook } from "lucide-react";


export const blogpost = defineType({
  name: "blogpost",
  title: "Blog Posts",
  type: "document",
  icon: Notebook,
  fields: [
    defineField({
      name: "maintitle",
      type: "string",
    }),
    defineField({
        name: "subtitle",
        type: "string",
      }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "maintitle",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "views",
      type: "number",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) =>
        Rule.min(1).max(20).required().error("Please enter a category"),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      type: "markdown",
    }),
  ],
});