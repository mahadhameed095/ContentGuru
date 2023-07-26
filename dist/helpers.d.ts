import { z } from "zod";
import { AnyZodObject, Page, PagesTypeUnionRecursive, Section } from "./types";
export declare function isPage(value: any): value is Page<any>;
export declare function isSection(value: any): value is Section<any>;
export declare function isValidObject(schema: AnyZodObject, data: unknown): boolean;
export declare function Map<T extends Section, U extends any>(section: T, fn: (Page: PagesTypeUnionRecursive<T>, i: number) => U): Array<U>;
export declare function ForEach<T extends Section>(section: T, fn: (Page: PagesTypeUnionRecursive<T>, i: number) => any): void;
export declare function Filter<T extends Section, F extends AnyZodObject>({ section, filter, fn }: {
    section: T;
    filter?: F;
    fn?: (Page: PagesTypeUnionRecursive<T, z.infer<F>>, i: number) => boolean;
}): Array<PagesTypeUnionRecursive<T, z.infer<F>>>;
//# sourceMappingURL=helpers.d.ts.map