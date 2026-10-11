import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detailedDescription",
      title: "Detailed Description",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL (uploaded)",
      type: "string",
      description: "Optional custom image URL. If set, it takes priority over the screenshot.",
    }),
    defineField({
      name: "screenshotUrl",
      title: "Screenshot URL",
      type: "url",
      description: "Exact page to auto-capture for the preview (e.g. https://site.com/products). Falls back to Store URL.",
    }),
    defineField({
      name: "storeUrl",
      title: "Store URL",
      type: "url",
    }),
    defineField({
      name: "adminUrl",
      title: "Admin Dashboard URL",
      type: "url",
    }),
    defineField({
      name: "adminEmail",
      title: "Admin Email (Demo)",
      type: "string",
    }),
    defineField({
      name: "adminPassword",
      title: "Admin Password (Demo)",
      type: "string",
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          name: "featureGroup",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Store", value: "store" },
                  { title: "Admin", value: "admin" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Group Title",
              type: "string",
            }),
            defineField({
              name: "items",
              title: "Feature Items",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category" },
          },
        },
      ],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
