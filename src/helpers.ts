import {
    AnyZodObject, 
} from "zod";
import { 
    Section,
    Page,
    PagesTypeUnion,
    PagesTypeUnionWithFilter,
    ZodInfer, 
} from "./types.js";

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
export function Map<T extends Section, U extends unknown>(section : T, fn : (page : PagesTypeUnion<T>, i : number) => U) : Array<U>{
    const pages : U[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as any[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as any[];

    pages.push(...definedPages.map(fn));
    pages.push(...(section.pages as any[]).map(fn));

    definedSections.forEach(section => {
        pages.push(...Map(section, fn));
    });

    section.sections.forEach(section => {
        pages.push(...Map(section as any, fn));
    });

    return pages;
}

export function ForEach<T extends Section>(section : T, fn : (Page : PagesTypeUnion<T>, i : number) => any){
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as any[];
                            
    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as any[];
    (section.pages as any[]).forEach(fn);
    definedPages.forEach(fn);
    definedSections.forEach(section => {
        ForEach<Section>(section, fn as any);
    });
    section.sections.forEach(section => {
        ForEach<Section>(section, fn as any);
    });
}

export function Filter<T extends Section, F extends AnyZodObject>({ section, filter, fn } : {
    section : T;
    filter ?: F;
    fn ?: (Page :PagesTypeUnionWithFilter<T, ZodInfer<F>>, i : number) => boolean;
}) : Array<PagesTypeUnionWithFilter<T, ZodInfer<F>>> {

    const pages : any[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as any[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as any[];
    
    const outerFun = (page : any, i : number) =>  {
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
