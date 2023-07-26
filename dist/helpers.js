"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = exports.ForEach = exports.Map = exports.isValidObject = exports.isSection = exports.isPage = void 0;
function isPage(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'frontmatter' in value;
}
exports.isPage = isPage;
function isSection(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'pages' in value;
}
exports.isSection = isSection;
function isValidObject(schema, data) {
    try {
        schema.parse(data);
        return true;
    }
    catch {
        return false;
    }
}
exports.isValidObject = isValidObject;
function Map(section, fn) {
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
exports.Map = Map;
function ForEach(section, fn) {
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
exports.ForEach = ForEach;
function Filter({ section, filter, fn }) {
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
exports.Filter = Filter;
//# sourceMappingURL=helpers.js.map