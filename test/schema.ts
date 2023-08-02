import { z } from "zod";
import { ModelTree, Page, PagesBaseUnionRecursive, TransformTree } from "../src/types.js";

const blogSchema = {
    index : {
        metadata : z.object({
            description : z.string()
        }),
    },
    pages : {
        metadata : z.object({
            title : z.string(),
            author : z.string(),
            tags : z.array(z.string()),
            categories : z.array(z.string())
        })
    }
};

type section = TransformTree<typeof blogSchema>;
let s : section;

type pages = Page<PagesBaseUnionRecursive<TransformTree<typeof blogSchema>>>;
// const pages : pages = {
//     metadata : {
        
//     }
// }
