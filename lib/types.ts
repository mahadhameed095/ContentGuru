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

export type ArchetypeTree<T extends ZodTypeAny = ZodTypeAny> = {
  pages ?: T;
  sections ?: ArchetypeTree<T>;
  [K : string] : T | ArchetypeTree<T> | undefined;
};

export type Section<T extends Record<string, any>={}> = {
  path : string;
  pages ?: Array<Page<T>>;
  sections ?: Array<Section<T>>
};

type TransformTree<T extends ArchetypeTree> = {
  [K in keyof T] : 
    T[K] extends ZodTypeAny ? 
      K extends 'pages' ? Array<Page<ZodInfer<T[K]>>>
                        : Page<ZodInfer<T[K]>>

    : T[K] extends ArchetypeTree ?
        K extends 'sections' ? Array<TransformTree<T[K]>>
                             : TransformTree<T[K]>
    : never
}

// type AddSectionsAndPages<T extends TransformTree<any>, U extends Record<string, any>=any> = {
//   [K in keyof T] : 'pages' extends keyof T ?
//                       T[K] extends Record<string, any> ?
//                         AddSectionsAndPages<T[K], T['pages'][number]>
//                       : T[K] extends Array<Record<string, any>> ?
//                         Array<AddSectionsAndPages<T[K], T['pages'][number]>>
//                       : T[K]
//                       : T[K] extends Record<string, any> ?
//                         AddSectionsAndPages<T[K], U>
//                       : T[K] extends Array<Record<string, any>> ?
//                         Array<AddSectionsAndPages<T[K], U>>
//                       : T[K]
// } & {
//   path : string;
//   sections : T extends { sections : any } ? T['sections'] : 
//               'pages' extends keyof T ?
//                   Array<Section<T['pages'][number]>>
//                                       :
//                   Array<Section<U>>;
//   pages : T extends { pages : any } ? T['pages'] : Array<Page<U>>;
// }

export type Output<T extends ArchetypeTree> = TransformTree<T>;


export type Config<T> = {
    inputDir : string;
    schemaTree : T;
    build : (source : string) => Promise<Content>
    rootPagesSchema : ZodTypeAny;
}


// export type Section<T extends Record<string, any>={}> = {
//   path : string;
//   pages ?: Array<Page<T>>;
//   sections ?: Array<Section<T>>
// };

// type TransformTree<T extends ArchetypeTree> = {
//   [K in keyof T] : 
//     T[K] extends ZodTypeAny ? 
//       K extends 'pages' ? Array<Page<ZodInfer<T[K]>>>
//                         : Page<ZodInfer<T[K]>>

//     : T[K] extends ArchetypeTree ?
//         K extends 'sections' ? Array<TransformTree<T[K]>>
//                              : TransformTree<T[K]>
//     : never
// }
