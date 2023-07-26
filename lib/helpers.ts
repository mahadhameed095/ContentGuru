import { z } from "zod";
import {  AnyZodObject, Page, PagesTypeUnionRecursive, Section } from "./types";

export function isPage(value : any) : value is Page<any> {
    return 'frontmatter' in value;
}

export function isSection(value : any) : value is Section<any>{
    return 'pages' in value;
}


export function Map<T extends Section>(section : T, fn : (Page : PagesTypeUnionRecursive<T>, i : number) => any) : Array<PagesTypeUnionRecursive<T>>{
    const pages : Page[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section[];
    
    pages.push(...section.pages.concat(definedPages).map(fn));
    
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Map<Section>(section, fn));
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

export function Filter<T extends Section, F extends AnyZodObject>({ section, filter, fn } : {
    section : T;
    filter ?: F;
    fn ?: (Page : PagesTypeUnionRecursive<T, z.infer<F>>, i : number) => boolean;
}) : Array<PagesTypeUnionRecursive<T, z.infer<F>>> {
    const pages : Page[] = [];
    const definedPages = Object.keys(section)
                            .filter(key => isPage(section[key]))
                            .map(key => section[key]) as Page[];

    const definedSections = Object.keys(section)
                                    .filter(key => isSection(section[key]))
                                    .map(key => section[key]) as Section[];
    
    pages.push(...section.pages.concat(definedPages).filter( (page, i) => {
        const first = fn ? fn(page, i) : true;
        const second = filter ? filter.parse(page.frontmatter) : true;
        return first && second;
    }));
    
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Filter<Section, F>({section, filter, fn}));
    });

    return pages;
}