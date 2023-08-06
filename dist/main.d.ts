import { z } from "zod";
import { TransformTree } from "./src/types.js";
export declare const blogSchema: {
    index: {
        metadata: z.ZodObject<{
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
        }, {
            description: string;
        }>;
        computedFields: (page: {
            readonly content: string;
            readonly path: string;
            readonly source: string;
            readonly metadata: import("./src/types.js").Obj;
        }) => {
            slugAsParams: string;
        };
    };
    pages: {
        metadata: z.ZodObject<{
            description: z.ZodString;
            tags: z.ZodArray<z.ZodString, "many">;
            categories: z.ZodArray<z.ZodString, "many">;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            tags: string[];
            categories: string[];
            title: string;
        }, {
            description: string;
            tags: string[];
            categories: string[];
            title: string;
        }>;
        computedFields: (page: {
            readonly content: string;
            readonly path: string;
            readonly source: string;
            readonly metadata: import("./src/types.js").Obj;
        }) => {
            slugAsParams: string;
            slug: string[];
        };
    };
};
export type meow = TransformTree<typeof blogSchema>;
//# sourceMappingURL=main.d.ts.map