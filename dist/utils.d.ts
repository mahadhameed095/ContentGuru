import { AnyZodObject } from "zod";
import { Model, Page, Section } from "./types.js";
export declare const trimFileExtension: (filename: string) => string;
export declare const ZodValidatePageWithErrorMessage: (schema: AnyZodObject, page: Page) => void;
export declare function isPage(value: any): value is Page;
export declare function isSection(value: any): value is Section;
export declare function isValidObject(schema: AnyZodObject, data: unknown): boolean;
export declare function isModel(value: any): value is Model;
//# sourceMappingURL=utils.d.ts.map