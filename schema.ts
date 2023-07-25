import {z} from 'zod';
export const PagesSchema = {
    blog : {
      index : z.object({
        description: z.string(),
      }),
      pages : z.object({
        title: z.string(),
        categories: z.array(z.string()),
        tags: z.array(z.string()),
        author: z.string(),
        description : z.string()
      })
    },
    tutorials : {
      index : z.object({
        description: z.string(),
      }),
      sections : {
        index : z.object({
          title: z.string(),
          description: z.string(),
          categories: z.array(z.string()),
          tags: z.array(z.string()),
          author: z.string(),
        }),
        pages : z.object({
          title : z.string(),
          description : z.string(),
          order : z.number()
        })
      },
    },
    pages : z.object({
      description: z.string(),
      tags : z.array(z.string()),
      hello : z.number()
    }),
  } satisfies ArchetypeTree;