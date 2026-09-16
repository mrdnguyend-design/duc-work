import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  /** Slug of the sibling translation, so the language switcher can deep-link. */
  translationOf: z.string().optional(),
});

const caseSchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Short, scannable outcome line: "+29.8% email revenue in 30 days" */
  outcome: z.string(),
  role: z.string(),
  period: z.string(),
  stack: z.array(z.string()).default([]),
  order: z.number().default(99),
  draft: z.boolean().default(false),
  translationOf: z.string().optional(),
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: pageSchema,
  }),
  posts: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: postSchema,
  }),
  cases: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
    schema: caseSchema,
  }),
};
