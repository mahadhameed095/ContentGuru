import {AnyZodObject, z } from "zod";
import { Page, Section, PagesTypeUnion, PagesTypeUnionWithFilter } from "./types.js";

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

/* Any is passed to section, and page generic until i can figure out the correct way to do this. */
export function Map<T extends Section<any>, U extends unknown>(section : T, fn : (page : PagesTypeUnion<T>, i : number) => U) : Array<U>{
    const pages : U[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page<any>[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section[];
    pages.push(...definedPages.map(fn));
    pages.push(...section.pages.map(fn));                  
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Map<Section, U>(section, fn));
    });
    return pages;
}

export function ForEach<T extends Section<any>>(section : T, fn : (Page : PagesTypeUnion<T>, i : number) => any){
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

export function Filter<T extends Section<any>, F extends AnyZodObject>({ section, filter, fn } : {
    section : T;
    filter ?: F;
    fn ?: (Page : PagesTypeUnionWithFilter<T, z.infer<F>>, i : number) => boolean;
}) : Array<PagesTypeUnionWithFilter<T, z.infer<F>>> {
    const pages : PagesTypeUnionWithFilter<T, z.infer<F>>[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page<any>[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section[];
    
    const outerFun = (page : Page<any>, i : number) =>  {
        const first = filter ? isValidObject(filter, page.metadata) : true;
        if (!first) return false; /* more preference given to the filter. it will return early only when filter is defined, and not validated. */
        const second = fn ? fn(page, i) : true;
        return second; 
    }

    pages.push(...definedPages.filter(outerFun));
    pages.push(...section.pages.filter(outerFun));

    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Filter<Section<any>, F>({section, filter, fn}));
    });

    return pages;
}