import { TaxonomyContent } from "./types"

export function WithTaxonomies<T extends any, U extends readonly string[]>
(content : T, taxonomies : U) : TaxonomyContent<T, U>{
    const structure : any = {};
    return structure;
};