import { bundleMDX } from "mdx-bundler";

export async function buildDoc(source : string){
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