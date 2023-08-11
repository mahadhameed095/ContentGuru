import { AnyZodObject } from "zod";
import { Section, Page, PagesTypeUnion, PagesTypeUnionWithFilter, ZodInfer } from "./types.js";
export declare function isPage(value: any): value is Page;
export declare function isSection(value: any): value is Section<any>;
export declare function isValidObject(schema: AnyZodObject, data: unknown): boolean;
export declare function Map<T extends Section, U extends unknown>(section: T, fn: (page: PagesTypeUnion<T>, i: number) => U): Array<U>;
export declare function ForEach<T extends Section>(section: T, fn: (Page: PagesTypeUnion<T>, i: number) => any): void;
export declare function Filter<T extends Section, F extends AnyZodObject>({ section, filter, fn }: {
    section: T;
    filter?: F;
    fn?: (Page: PagesTypeUnionWithFilter<T, ZodInfer<F>>, i: number) => boolean;
}): Array<PagesTypeUnionWithFilter<T, ZodInfer<F>>>;
//# sourceMappingURL=helpers.d.ts.map