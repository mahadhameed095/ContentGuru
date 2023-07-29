import { AnyZodObject, z } from 'zod';
export type { AnyZodObject };
type ZodInfer<T extends AnyZodObject> = z.infer<T>;
export type PageContent<T extends Record<string, any> = any> = {
    readonly frontmatter: T;
    readonly code: string;
};
export type Page<T extends Record<string, any> = any> = {
    readonly path: string;
    readonly source: string;
} & PageContent<T>;
export type Section<T extends Record<string, any> = any> = {
    readonly path: string;
    readonly pages: Array<Page<T>>;
    readonly sections: Array<Section<T>>;
    [k: string]: Page | Section | Array<Page<T>> | Array<Section<T>> | string;
};
export type ArchetypeTree<T extends AnyZodObject = AnyZodObject> = {
    pages?: T;
    sections?: ArchetypeTree<T>;
    [K: string]: T | ArchetypeTree<T> | undefined;
};
export type TransformTree<T extends ArchetypeTree, U extends AnyZodObject> = {
    [K in keyof T]: T[K] extends AnyZodObject ? K extends 'pages' ? Array<Page<NonNullable<ZodInfer<T[K]>>>> : undefined extends ZodInfer<T[K]> ? Page<NonNullable<ZodInfer<T[K]>>> | undefined : Page<ZodInfer<T[K]>> : T[K] extends ArchetypeTree ? T extends {
        pages: AnyZodObject;
    } ? K extends 'sections' ? Array<TransformTree<T[K], T['pages']>> : TransformTree<T[K], T['pages']> : K extends 'sections' ? Array<TransformTree<T[K], U>> : TransformTree<T[K], U> : never;
} & (T extends {
    sections: ArchetypeTree;
} ? {} : {
    sections: T extends {
        pages: AnyZodObject;
    } ? Array<Section<ZodInfer<T['pages']>>> : Array<Section<ZodInfer<U>>>;
}) & (T extends {
    pages: AnyZodObject;
} ? {} : {
    pages: Array<Page<ZodInfer<U>>>;
}) & {
    path: string;
};
type UnionObjectValues<T> = T[keyof T];
type _PagesTypeUnionRecursive<T extends Section, Filter extends Record<string, any> = {}> = {
    [key in keyof T]: T[key] extends Array<Page<infer U>> ? U extends Filter ? U : undefined : T[key] extends Page<infer U> ? U extends Filter ? U : undefined : T[key] extends Array<Section> ? UnionObjectValues<_PagesTypeUnionRecursive<T[key][number], Filter>> : T[key] extends Section ? UnionObjectValues<_PagesTypeUnionRecursive<T[key], Filter>> : undefined;
};
export type PagesTypeUnionRecursive<T extends Section, Filter extends Record<string, any> = {}> = Page<NonNullable<UnionObjectValues<_PagesTypeUnionRecursive<T, Filter>>>>;
//# sourceMappingURL=types.d.ts.map