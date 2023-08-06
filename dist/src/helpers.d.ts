import { AnyZodObject } from "zod";
import { Page, Section } from "./types.js";
export declare function isPage(value: any): value is Page;
export declare function isSection(value: any): value is Section<any>;
export declare function isValidObject(schema: AnyZodObject, data: unknown): boolean;
export declare function Map<T extends Section, U extends unknown>(section: T, fn: (page: Page, i: number) => U): Array<U>;
export declare function ForEach<T extends Section>(section: T, fn: (Page: Page, i: number) => any): void;
export declare function Filter<T extends Section<any>, F extends AnyZodObject>({ section, filter, fn }: {
    section: T;
    filter?: F;
    fn?: (Page: Page, i: number) => boolean;
}): Array<Page>;
//# sourceMappingURL=helpers.d.ts.map