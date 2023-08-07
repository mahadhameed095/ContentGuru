export function isPage(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'metadata' in value;
}
export function isSection(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'pages' in value;
}
export function isValidObject(schema, data) {
    try {
        schema.parse(data);
        return true;
    }
    catch {
        return false;
    }
}
/* Any is passed to section, and page generic until i can figure out the correct way to do this. */
export function Map(section, fn) {
    const pages = [];
    const definedPages = Object.keys(section)
        .filter(key => isPage(section[key]))
        .map(key => section[key]);
    const definedSections = Object.keys(section)
        .filter(key => isSection(section[key]))
        .map(key => section[key]);
    pages.push(...definedPages.map(fn));
    pages.push(...section.pages.map(fn));
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Map(section, fn));
    });
    return pages;
}
export function ForEach(section, fn) {
    const definedPages = Object.keys(section)
        .filter(key => isPage(section[key]))
        .map(key => section[key]);
    const definedSections = Object.keys(section)
        .filter(key => isSection(section[key]))
        .map(key => section[key]);
    section.pages.concat(definedPages).forEach(fn);
    definedSections.concat(section.sections).forEach(section => {
        ForEach(section, fn);
    });
}
export function Filter({ section, filter, fn }) {
    const pages = [];
    const definedPages = Object.keys(section)
        .filter(key => isPage(section[key]))
        .map(key => section[key]);
    const definedSections = Object.keys(section)
        .filter(key => isSection(section[key]))
        .map(key => section[key]);
    const outerFun = (page, i) => {
        const first = filter ? isValidObject(filter, page.metadata) : true;
        if (!first)
            return false; /* more preference given to the filter. it will return early only when filter is defined, and not validated. */
        const second = fn ? fn(page, i) : true;
        return second;
    };
    pages.push(...definedPages.filter(outerFun));
    pages.push(...section.pages.filter(outerFun));
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Filter({ section, filter, fn }));
    });
    return pages;
}
//# sourceMappingURL=helpers.js.map