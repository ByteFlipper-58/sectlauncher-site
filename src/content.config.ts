import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    private: z.boolean().optional().default(false),
    publishAt: z.coerce.date().optional(),
    premiere: z.boolean().optional().default(false),

    draft: z.boolean().optional().default(false),
    heroImage: z.string().optional(),
    media: z
      .array(
        z.object({
          type: z.enum(['image', 'video']).default('image'),
          src: z.string(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    author: z
      .object({
        name: z.string(),
        avatar: z.string().optional(),
        role: z.string().optional(),
        links: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            })
          )
          .optional(),
      })
      .optional(),
    lang: z.enum(['ru','en']).default('ru'),
    tKey: z.string().optional(),
  }),
});

export const collections = {
  blog,
};

