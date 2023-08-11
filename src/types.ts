import {AnyZodObject, z} from 'zod';

export type ZodInfer<T extends AnyZodObject> = z.infer<T>;
export type Obj = Record<string, any>;

export type IsEmptyObject<Obj extends Record<PropertyKey, unknown>> =
    [keyof Obj] extends [never] ? true : false

export type PageContent<M extends Obj=Obj> = {
  readonly metadata : M;
  readonly content : string;
}

export type Page<M extends Obj=Obj, C extends Obj={}> = {
  readonly content : string;
  readonly path :  string;
  readonly source : string;
  readonly metadata : M;
} & (
  IsEmptyObject<C> extends true ? { readonly computedFields ?: Obj } : { readonly computedFields : C } 
);

export type Section<M extends Obj=Obj, C extends Obj={}> = {
  readonly path : string;
  readonly pages : Array<Page<M, C>>;
  readonly sections : Array<Section<M, C>>;
  [k : string] : Page | Section | Array<Page<M, C>> | Array<Section<M, C>> | string;
  /* The extra types other than Page and Section are here because typescript does not support negated types yet https://github.com/microsoft/TypeScript/issues/4196*/
  /* [k : string ~ ("pages" | "sections")] : Page | Section*/
  /* Something like this should be possible eventually. hopefully... */
}

export type Model<M extends AnyZodObject=AnyZodObject, C extends Obj={}> = {
  readonly metadata : M;
  readonly computedFields ?: (page : Page) => C;
};


export type ModelTree<T extends Model=Model> = {
  pages ?: T;
  sections ?: ModelTree<T>;
  [K : string] : T | ModelTree<T> | undefined;
};

export type TransformTree<T extends ModelTree, U extends Model=Model> = {
  [K in keyof T]: 
    T[K] extends Model<infer F, infer C> ?
      K extends 'pages' ? T[K] extends { computedFields : any } ? 
                          Array<Page<NonNullable<ZodInfer<F>>, C>>
                        : Array<Page<NonNullable<ZodInfer<F>>>>

    : undefined extends ZodInfer<F> ?
                          T[K] extends { computedFields : any } ?
                          Page<NonNullable<ZodInfer<F>>, C> | undefined
                        : Page<NonNullable<ZodInfer<F>>> | undefined
                        
                        : T[K] extends { computedFields : any } ?
                          Page<ZodInfer<F>, C>
                        : Page<ZodInfer<F>>
  
  : T[K] extends ModelTree ?
      T extends {pages : AnyZodObject} ?
              K extends 'sections' ? 
                Array<TransformTree<T[K], T['pages']>>
              : TransformTree<T[K], T['pages']>
            : K extends 'sections' ?
                Array<TransformTree<T[K], U>>
              : TransformTree<T[K], U>
  : never
}
& (T extends { sections: ModelTree } ? {} : 
  { sections: T extends { pages : Model<infer M, infer C> } ? 
      Array<Section<ZodInfer<M>, C>> 
      : U extends Model<infer M, infer C> ?
      Array<Section<ZodInfer<M>, C>> 
    : never 
  }

) 
/* Add path variable */
 & { path : string }

 /* If pages is not defined then add pages of inherited type */
& (T extends { pages : Model } ? {} :
  { 
    pages : U extends Model<infer M, infer C> ?
        Array<Page<ZodInfer<M>, C>>
      : never
  }

)

type PagesBaseUnion<T extends Section> = {
  [key in keyof T] : T[key] extends Array<Page<infer M, infer C>> ? [M, C]
                   : T[key] extends Page<infer M, infer C> ? [M, C]
                   : T[key] extends Array<Section> ?
                      PagesBaseUnion<T[key][number]>
                   : T[key] extends Section ?
                      PagesBaseUnion<T[key]>
                   : never;
}[keyof T];

type PagesBaseUnionWithFilter<T extends Section, F extends Obj> = {
  [key in keyof T] : T[key] extends Array<Page<infer M, infer C>> ?
                      M extends F ? [M, C] : undefined
                   : T[key] extends Page<infer M, infer C> ?
                      M extends F ? [M, C] : undefined
                   : T[key] extends Array<Section> ?
                      PagesBaseUnion<T[key][number]>
                   : T[key] extends Section ?
                      PagesBaseUnion<T[key]>
                   : never;
}[keyof T];

export type PageTypeCreator<T extends [Obj, Obj]> = Page<T[0], T[1]>;
export type SectionTypeCreator<T extends [Obj, Obj]> = Section<T[0], T[1]>;

export type PagesTypeUnion<T extends Section> = PageTypeCreator<PagesBaseUnion<T>>;
export type SectionTypeUnion<T extends Section> = SectionTypeCreator<PagesBaseUnion<T>>;

export type PagesTypeUnionWithFilter<T extends Section, F extends Obj> = 
    NonNullable<
      PagesBaseUnionWithFilter<T, F>> extends infer R ? R extends [Obj, Obj] ? PageTypeCreator<R> : never : never;