import { ArchetypeTree } from "./lib/types";
import z from 'zod';
import { makeContent } from "./lib/makeContent";
import { bundleMDX } from "mdx-bundler";

const PagesSchema = {
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
  }),
} satisfies ArchetypeTree;


async function buildDoc(source : string){
  const {frontmatter, code} = await bundleMDX({
    source,
    esbuildOptions(options){
      options.define ={ 
        'process.env.NODE_ENV' : process.env.NODE_ENV || `"development"`
      }
      return options;
    },
  });
  return {frontmatter, code};
}

makeContent({
  inputDir : 'content',
  schemaTree : PagesSchema,
  build : buildDoc,
  rootPagesSchema : z.object({
    description : z.string()
  })
}).then(Content => {
  console.log(
    Content.blog.pages.map(blogPost => blogPost.frontmatter)
  )
});
