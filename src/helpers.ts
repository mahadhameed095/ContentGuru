import {AnyZodObject, z } from "zod";
import { Page, Section, PagesTypeUnionRecursive } from "./types.js";

export function isPage(value : any) : value is Page {
    if(!value || typeof value !== 'object') return false;
    return 'metadata' in value; 
}

export function isSection(value : any) : value is Section<any>{
    if(!value || typeof value !== 'object') return false;
    return 'pages' in value;
}

export function isValidObject(schema : AnyZodObject, data : unknown) {
    try{
        schema.parse(data)
        return true;
    } catch {
        return false;
    }
}

export function Map<T extends Section, U extends unknown>(section : T, fn : (page : PagesTypeUnionRecursive<T>, i : number) => U) : Array<U>{
    const pages : U[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section<PagesTypeUnionRecursive<T>>[];
    
    pages.push(...definedPages.map(fn));
    pages.push(...section.pages.map(fn));                           
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Map<Section, U>(section, fn));
    });
    return pages;
}

export function ForEach<T extends Section>(section : T, fn : (Page : PagesTypeUnionRecursive<T>, i : number) => any){
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page[];
                            
    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section[];
    section.pages.concat(definedPages).forEach(fn);
    
    definedSections.concat(section.sections).forEach(section => {
        ForEach<Section>(section, fn);
    });
}

// export function Filter<T extends Section, F extends AnyZodObject>({ section, filter, fn } : {
//     section : T;
//     filter ?: F;
//     fn ?: (Page : PagesTypeUnionRecursive<T, z.infer<F>>, i : number) => boolean;
// }) : Array<PagesTypeUnionRecursive<T, z.infer<F>>> {
//     const pages : PagesTypeUnionRecursive<T, z.infer<F>>[] = [];
//     const definedPages = Object.keys(section)
//                             .filter(key => isPage(section[key]))
//                             .map(key => section[key]) as Page[];

//     const definedSections = Object.keys(section)
//                                     .filter(key => isSection(section[key]))
//                                     .map(key => section[key]) as Section[];
    
//     pages.push(...section.pages.concat(definedPages).filter( (page, i) => {
//         const first = filter ? isValidObject(filter, page.metadata) : true;
//         if (!first) return false; /* more preference given to the filter. it will return early only when filter is defined, and not validated. */
//         const second = fn ? fn(page, i) : true;
//         return second;
//     }));
    
//     definedSections.concat(section.sections).forEach(section => {
//         pages.push(...Filter<Section, F>({section, filter, fn}));
//     });

//     return pages;
// }