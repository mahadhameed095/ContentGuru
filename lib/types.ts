import {ZodTypeAny, z} from 'zod';

export type { ZodTypeAny };

type ZodInfer<T extends ZodTypeAny> = z.infer<T>;

export type PageContent<T extends Record<string, any>=any> = {
    frontmatter : T;
    code : string;
}
export type Page<T extends Record<string, any> = any> = {
    path : string;
} & PageContent<T>

export type Section<T extends Record<string, any>=any> = {
  path : string;
  pages ?: Array<Page<T>>;
  sections ?: Array<Section<T>>
};

export type ContentTree = {
  [k : string] : Page | Section | undefined;
} & Section;

export type ArchetypeTree<T extends ZodTypeAny = ZodTypeAny> = {
  pages ?: T;
  sections ?: ArchetypeTree<T>;
  [K : string] : T | ArchetypeTree<T> | undefined;
};

export type TransformTree<T extends ArchetypeTree, U extends ZodTypeAny=any> = {
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

type UnionObjectValues<T> = T[keyof T];

type _Taxonomize<T extends any, Taxonomy extends string> = {
  [key in keyof T] : T[key] extends Array<Page<infer U>> ?
                        Taxonomy extends keyof U ? U : undefined
                   : T[key] extends Page<infer U> ?
                        Taxonomy extends keyof U ? U : undefined
                   : T[key] extends Array<Record<string, any>> ?
                      UnionObjectValues<_Taxonomize<T[key][number], Taxonomy>>
                   : T[key] extends Record<string, any> ?
                      UnionObjectValues<_Taxonomize<T[key], Taxonomy>>
                   : undefined
                    
};
type Taxonomize<T extends any, Taxonomy extends string> = NonNullable<UnionObjectValues<_Taxonomize<T, Taxonomy>>>;

export type TaxonomyContent<T extends any, U extends readonly string[]> = {
  [K in U[number]] : { all : string[], pages : Array<Page<Taxonomize<T, K>>>}
}
/* Taxonomize<T, K> extends never ? undefined :  */

export type MakeContentProps<T extends ArchetypeTree, U extends ZodTypeAny> = {
  inputDir : string;
  schemaTree : T;
  build : (source : string) => Promise<PageContent>
  rootPagesSchema : U;
}
// export type WithTaxonomiesProps = {

// }