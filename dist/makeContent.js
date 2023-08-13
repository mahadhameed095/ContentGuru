import { z } from 'zod';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { ZodParsePageMetadataWithErrorMessage, isModel, trimFileExtension } from './utils.js';
import { existsSync } from 'fs';
async function GetFilesAndFolders(inputDir) {
    const dirents = await readdir(inputDir, { withFileTypes: true });
    const result = dirents.reduce((acc, dirent) => {
        dirent.isFile() && acc.files.push(dirent.name);
        dirent.isDirectory() && acc.folders.push(dirent.name);
        return acc;
    }, {
        files: [],
        folders: []
    });
    return result;
}
export default async function MakeContent({ inputDir, modelTree, build, rootPagesSchema }) {
    const section = {
        path: inputDir,
        pages: [],
        sections: []
    };
    const { files, folders } = await GetFilesAndFolders(inputDir);
    const schemaKeys = Object.keys(modelTree).filter(key => key !== 'sections' && key !== 'pages');
    const definedFilesInSchema = schemaKeys.filter(key => isModel(modelTree[key]));
    const definedFoldersInSchema = schemaKeys.filter(key => !definedFilesInSchema.includes(key));
    const notDefinedFiles = files.filter(file => !definedFilesInSchema.includes(trimFileExtension(file)));
    const notDefinedFolders = folders.filter(folder => !definedFoldersInSchema.includes(folder));
    const pagesModel = modelTree['pages'] ||
        rootPagesSchema ||
        { metadata: z.object({}), computedFields: undefined };
    await Promise.all(definedFilesInSchema.map(async (filename) => {
        const path = join(inputDir, filename + '.mdx');
        if (existsSync(path)) {
            const source = await readFile(path, 'utf-8');
            const data = await build(source);
            let page = { ...data, source, path };
            const model = modelTree[filename];
            page.metadata = ZodParsePageMetadataWithErrorMessage(model['metadata'], page.path, page.metadata);
            const computedFields = model.computedFields ?
                { computedFields: model['computedFields'](page) } : {};
            section[filename] = { ...page, ...computedFields };
        }
        else if (!modelTree[filename]['metadata'].isOptional()) { /* if file was required */
            throw `${path} is not found yet required in schema!`;
        } /* do nothing if it was optional and not found*/
    }));
    await Promise.all(notDefinedFiles.map(async (filename) => {
        const path = join(inputDir, filename);
        const source = await readFile(path, 'utf-8');
        const data = await build(source);
        const page = { ...data, source, path };
        page.metadata = ZodParsePageMetadataWithErrorMessage(pagesModel['metadata'], page.path, page.metadata);
        const computedFields = pagesModel.computedFields ?
            { computedFields: pagesModel['computedFields'](page) } : {};
        section['pages'].push({
            ...computedFields,
            ...page
        });
    }));
    await Promise.all(definedFoldersInSchema.map(async (folder) => {
        const fullPath = join(inputDir, folder);
        section[folder] = await MakeContent({
            inputDir: fullPath,
            modelTree: modelTree[folder],
            build,
            rootPagesSchema: pagesModel
        });
    }));
    await Promise.all(notDefinedFolders.map(async (folder) => {
        const fullPath = join(inputDir, folder);
        section['sections'].push(await MakeContent({
            inputDir: fullPath,
            modelTree: modelTree['sections'] || { pages: pagesModel },
            build,
            rootPagesSchema: pagesModel
        }));
    }));
    return section;
}
//# sourceMappingURL=makeContent.js.map