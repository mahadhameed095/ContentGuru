import {AnyZodObject, z} from 'zod';

export type Obj = Record<string, any>;

type ZodInfer<T extends AnyZodObject> = z.infer<T>;

export type PageContent<M extends Obj=Obj> = {
  readonly metadata : M;
  readonly content : string;
}

export type PageBase<M extends Obj=Obj, C extends Obj=Obj> = {
  readonly metadata : M;
  readonly computedFields ?: C;
  // readonly computedFields ?: C extends undefined ? never : C;
}

export type Page<T extends PageBase=PageBase> = {
    readonly content : string;
    readonly path :  string;
    readonly source : string;
} & T

export type PageWithoutComputedFields<T extends Page=Page> = Omit<T, 'computedFields'>

export type Section<T extends PageBase=PageBase> = {
  readonly path : string;
  readonly pages : Array<Page<T>>;
  readonly sections : Array<Section<T>>;
  [k : string] : Page<T> | Section<T> | Array<Page<T>> | Array<Section<T>> | string; 
  /* The extra types other than Page and Section are here because typescript does not support negated types yet https://github.com/microsoft/TypeScript/issues/4196*/
  /* [k : string ~ ("pages" | "sections")] : Page | Section*/
  /* Something like this should be possible eventually. hopefully... */
};

export type Model<M extends AnyZodObject=AnyZodObject, C extends Obj=Obj> = {
  readonly metadata : M;
  readonly computedFields ?: (page : PageWithoutComputedFields) => C;
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
                          Array<Page<PageBase<ZodInfer<F>, C>>>
                        : Array<Page<PageBase<NonNullable<ZodInfer<F>>>>>
                        : undefined extends ZodInfer<F> ?
                          T[K] extends { computedFields : any } ?
                          Page<PageBase<NonNullable<ZodInfer<F>>, C>> | undefined
                        : Page<PageBase<NonNullable<ZodInfer<F>>>> | undefined
                        
                        : T[K] extends { computedFields : any } ?
                          Page<PageBase<ZodInfer<F>, C>>
                        : Page<PageBase<ZodInfer<F>>>
  
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
      Array<Section<PageBase<ZodInfer<M>, C>>> 
      : U extends Model<infer M, infer C> ?
      Array<Section<PageBase<ZodInfer<M>, C>>> 
    : never 
  }
/* If pages is not defined then add pages of inherited type */
) & (T extends { pages : AnyZodObject } ? {} :
  { 
    pages : 
      U extends Model<infer M, infer C> ?
        Array<Page<PageBase<ZodInfer<M>, C>>>
      : never
  }
/* Add path variable */
) & { path : string };

type UnionObjectValues<T> = T[keyof T];

type _PagesBaseUnionWithFilter<T extends Section, Filter extends Obj> = {
  [key in keyof T] : T[key] extends Array<Page<infer P>> ?
                      P['metadata'] extends Filter ? P : undefined 
                   : T[key] extends Page<infer P> ?
                      P['metadata'] extends Filter ? P : undefined 
                   : T[key] extends Array<Section> ?
                      UnionObjectValues<_PagesBaseUnionWithFilter<T[key][number], Filter>>
                   : T[key] extends Section ?
                      UnionObjectValues<_PagesBaseUnionWithFilter<T[key], Filter>>
                   : never
};

export type PagesBaseUnionWithFilter<T extends Section, Filter extends Obj> = 
    NonNullable<
      UnionObjectValues<
        _PagesBaseUnionWithFilter<T, Filter>>>;

export type PagesTypeUnionWithFilter<T extends Section, Filter extends Obj> = 
  PagesBaseUnionWithFilter<T, Filter> extends PageBase<infer M, infer C> ? Page<PageBase<M, C>> : Page;

type _PagesBaseUnion<T extends Section> = {
  [key in keyof T] : T[key] extends Array<Page<infer P>> ? P
                   : T[key] extends Page<infer P> ? P
                   : T[key] extends Array<Section> ?
                      UnionObjectValues<_PagesBaseUnion<T[key][number]>>
                   : T[key] extends Section ?
                      UnionObjectValues<_PagesBaseUnion<T[key]>>
                   : never;
};

export type PagesBaseUnion<T extends Section> = UnionObjectValues<_PagesBaseUnion<T>>;

export type PagesTypeUnion<T extends Section> = Page<PagesBaseUnion<T>>; 
