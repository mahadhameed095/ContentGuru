import { z } from "zod";
import { ModelTree, Transform } from "./src/types.js";

const blogArchetype = {
    index : {
        frontmatter : z.object({
            title : z.string(),
            description : z.string()
        }),
        computedFields : ({ path, frontmatter, source, code}) => {
            return {
                pathPieces : path.split('/'),
                tableOfContents : source
            }
        }
    }
} satisfies ModelTree;

const Transform = <T extends ModelTree>(o : T) : Transform<T> => {
    return o as any;
}

const blog = Transform(blogArchetype);

blog.index.frontmatter // {tile : "Mahad", description : "long live Mahad"}
blog.index.path // content/blog/index.mdx
blog.index.computedFields // { pathPieces : [....], tableOfContents = [{..}, {..},..]}