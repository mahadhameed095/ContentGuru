import { z } from "zod";
export const blogSchema = {
    index: {
        metadata: z.object({
            description: z.string()
        }),
        computedFields: (page) => {
            const pieces = page.path.split('/');
            return {
                slugAsParams: pieces[pieces.length - 1],
            };
        }
    },
    pages: {
        metadata: z.object({
            description: z.string(),
            tags: z.array(z.string()),
            categories: z.array(z.string()),
            title: z.string()
        }),
        computedFields: (page) => {
            const pieces = page.path.split('/');
            return {
                slugAsParams: pieces[pieces.length - 1],
                slug: pieces.slice(1)
            };
        }
    }
};
// const mewo : meow;
//# sourceMappingURL=main.js.map