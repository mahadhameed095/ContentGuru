// import { isPage, isSection } from "./helpers";
// import { Page, TaxonomyContent } from "./types"

// export function WithTaxonomies<T extends Record<string, any>, U extends readonly string[]>
// (content : T, taxonomies : U){
//     return taxonomies.reduce( (acc, current) => {

//     }, {
//         all : [] as string[],
//         pages : [] as Page[]
//     });
// };
// // : TaxonomyContent<T, U>
// // function extractAllPagesWithTaxonomy<T extends Record<string, any>>(content : T, taxonomy : string){
// //     let allPages : Page<any>[] = [];
// //     Object.entries(content).map(([key,value]) => {
// //         if(key === 'pages'){
// //             const pages = (value as Array<Page<any>>);
// //             allPages = allPages.concat(pages.filter(page => taxonomy in page.frontmatter));
// //         }
// //         else if(key === 'sections'){

// //         }
// //         else if(isPage(value)){

// //         }
// //         else if(isSection(value)){

// //         }   
// //     });
// // }