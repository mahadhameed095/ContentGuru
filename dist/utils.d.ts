import { AnyZodObject, ZodObject } from "zod";
import { Page } from "./types.js";
export declare const trimFileExtension: (filename: string) => string;
export declare const ZodValidatePageWithErrorMessage: (schema: AnyZodObject, page: Page) => void;
export declare const isZodObject: (schemaObject: object) => schemaObject is ZodObject<any, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>;
//# sourceMappingURL=utils.d.ts.map