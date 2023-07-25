import { z } from "zod";
import {  AnyZodObject, Page, PagesTypeUnionRecursive, Section } from "./types";

export function isPage(value : any) : value is Page<any> {
    return 'frontmatter' in value;
}

export function isSection(value : any) : value is Section<any>{
    return 'pages' in value;
}


export function Map<T extends Section>(content : T, fn : (Page : PagesTypeUnionRecursive<T>, i : number) => any) : Array<PagesTypeUnionRecursive<T>>;
export function ForEach<T extends Section>(content : T, fn : (Page : PagesTypeUnionRecursive<T>, i : number) => any) : void;
export function Filter<T extends Section, F extends AnyZodObject>(FilterProps : {
    content : T;
    filter ?: F;
    fn ?: (Page : PagesTypeUnionRecursive<T, z.infer<F>>, i : number) => boolean;
}) : Array<PagesTypeUnionRecursive<T, z.infer<F>>>;