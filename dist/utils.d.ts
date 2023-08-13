import { AnyZodObject } from "zod";
import { Model, Obj, Page, Section } from "./types.js";
export declare const trimFileExtension: (filename: string) => string;
export declare const ZodParsePageMetadataWithErrorMessage: (schema: AnyZodObject, pagePath: string, pageMetadata: Obj) => {
    [x: string]: any;
};
export declare function isPage(value: any): value is Page;
export declare function isSection(value: any): value is Section;
export declare function isValidObject(schema: AnyZodObject, data: unknown): boolean;
export declare function isModel(value: any): value is Model;
//# sourceMappingURL=utils.d.ts.map