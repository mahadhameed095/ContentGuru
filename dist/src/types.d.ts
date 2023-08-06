import { AnyZodObject, z } from 'zod';
export type ZodInfer<T extends AnyZodObject> = z.infer<T>;
export type Obj = Record<string, any>;
export type IsEmptyObject<Obj extends Record<PropertyKey, unknown>> = [
    keyof Obj
] extends [never] ? true : false;
export type PageContent<M extends Obj = Obj> = {
    readonly metadata: M;
    readonly content: string;
};
export type Page<M extends Obj = Obj, C extends Obj = {}> = {
    readonly content: string;
    readonly path: string;
    readonly source: string;
    readonly metadata: M;
} & (IsEmptyObject<C> extends true ? {} : {
    computedFields: C;
});
export type Section<M extends Obj = Obj, C extends Obj = {}> = {
    readonly path: string;
    readonly pages: Array<Page<M, C>>;
    readonly sections: Array<Section<M, C>>;
    [k: string]: Page | Section | Array<Page<M, C>> | Array<Section<M, C>> | string;
};
export type Model<M extends AnyZodObject = AnyZodObject, C extends Obj = {}> = {
    readonly metadata: M;
    readonly computedFields?: (page: Page) => C;
};
export type ModelTree<T extends Model = Model> = {
    pages?: T;
    sections?: ModelTree<T>;
    [K: string]: T | ModelTree<T> | undefined;
};
export type TransformTree<T extends ModelTree, U extends Model = Model> = {
    [K in keyof T]: T[K] extends Model<infer F, infer C> ? K extends 'pages' ? T[K] extends {
        computedFields: any;
    } ? Array<Page<ZodInfer<F>, C>> : Array<Page<NonNullable<ZodInfer<F>>>> : undefined extends ZodInfer<F> ? T[K] extends {
        computedFields: any;
    } ? Page<NonNullable<ZodInfer<F>>, C> | undefined : Page<NonNullable<ZodInfer<F>>> | undefined : T[K] extends {
        computedFields: any;
    } ? Page<ZodInfer<F>, C> : Page<ZodInfer<F>> : T[K] extends ModelTree ? T extends {
        pages: AnyZodObject;
    } ? K extends 'sections' ? Array<TransformTree<T[K], T['pages']>> : TransformTree<T[K], T['pages']> : K extends 'sections' ? Array<TransformTree<T[K], U>> : TransformTree<T[K], U> : never;
} & (T extends {
    sections: ModelTree;
} ? {} : {
    sections: T extends {
        pages: Model<infer M, infer C>;
    } ? Array<Section<ZodInfer<M>, C>> : U extends Model<infer M, infer C> ? Array<Section<ZodInfer<M>, C>> : never;
}) & (T extends {
    pages: AnyZodObject;
} ? {} : {
    pages: U extends Model<infer M, infer C> ? Array<Page<ZodInfer<M>, C>> : never;
}) & {
    path: string;
};
export type PagesTypeUnion<T extends Section> = {
    [key in keyof T]: T[key] extends Array<Page<infer P, infer U>> ? Page<P, U> : T[key] extends Page<infer P, infer U> ? Page<P, U> : T[key] extends Array<Section> ? PagesTypeUnion<T[key][number]> : T[key] extends Section ? PagesTypeUnion<T[key]> : never;
}[keyof T];
//# sourceMappingURL=types.d.ts.map