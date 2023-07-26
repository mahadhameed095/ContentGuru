export function isPage(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'frontmatter' in value;
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
export function Map(section, fn) {
    const pages = [];
    const definedPages = Object.keys(section)
        .filter(key => isPage(section[key]))
        .map(key => section[key]);
    const definedSections = Object.keys(section)
        .filter(key => isSection(section[key]))
        .map(key => section[key]);
    pages.push(...section.pages.concat(definedPages).map(fn));
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
    pages.push(...section.pages.concat(definedPages).filter((page, i) => {
        const first = fn ? fn(page, i) : true;
        const second = filter ? isValidObject(filter, page.frontmatter) : true;
        return first && second;
    }));
    definedSections.concat(section.sections).forEach(section => {
        pages.push(...Filter({ section, filter, fn }));
    });
    return pages;
}
//# sourceMappingURL=helpers.js.map