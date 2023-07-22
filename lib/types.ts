import {ZodTypeAny, z} from 'zod';

export type { ZodTypeAny };

type ZodInfer<T extends ZodTypeAny> = z.infer<T>;

export type Content<T extends Record<string, any>=any> = {
    frontmatter : T;
    code : string;
}
export type Page<T extends Record<string, any> = any> = {
    path : string;
} & Content<T>

export type Section<T extends Record<string, any>=any> = {
  path : string;
  pages ?: Array<Page<T>>;
  sections ?: Array<Section<T>>
};

export type ArchetypeTree<T extends ZodTypeAny = ZodTypeAny> = {
  pages ?: T;
  sections ?: ArchetypeTree<T>;
  [K : string] : T | ArchetypeTree<T> | undefined;
};


type TransformTree<T extends ArchetypeTree, U extends ZodTypeAny> = {
  [K in keyof T] : 
    T[K] extends ZodTypeAny ? 
      K extends 'pages' ? Array<Page<NonNullable<ZodInfer<T[K]>>>>
                        : undefined extends ZodInfer<T[K]> ? 
                          Page<NonNullable<ZodInfer<T[K]>>> | undefined
                        : Page<ZodInfer<T[K]>>
                        
    : T[K] extends ArchetypeTree ?
        T extends {pages : ZodTypeAny} ?
          K extends 'sections' ? 
            Array<TransformTree<T[K], T['pages']>>
          : TransformTree<T[K], T['pages']>
        : K extends 'sections' ?
            Array<TransformTree<T[K], U>>
          : TransformTree<T[K], U>
    : never
} 
/* If sections is not defined then add sections. when adding sections check if page types is defined. if yes use that or else use inherited page type */
& (T extends { sections: ArchetypeTree } ? {} : 
  { sections: T extends { pages : ZodTypeAny } ? 
      Array<Section<ZodInfer<T['pages']>>> 
    : Array<Section<ZodInfer<U>>> 
  }
/* If pages is not defined then add pages of inherited type */
) & (T extends { pages : ZodTypeAny } ? {} :
  { pages : Array<Page<ZodInfer<U>>> }
/* Add path variable */
) & { path : string };

export type Output<T extends ArchetypeTree, U extends ZodTypeAny> = TransformTree<T, U>

export type Config<T extends ArchetypeTree, U extends ZodTypeAny> = {
    inputDir : string;
    schemaTree : T;
    build : (source : string) => Promise<Content>
    rootPagesSchema : U;
}
