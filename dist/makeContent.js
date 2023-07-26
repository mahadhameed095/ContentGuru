import { ZodObject, z } from 'zod';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { trimFileExtension } from './utils';
import { existsSync } from 'fs';
export default async function MakeContent({ inputDir, schemaTree, build, rootPagesSchema }) {
    const structure = {
        path: inputDir,
        pages: [],
        sections: []
    };
    const dirents = await readdir(inputDir, { withFileTypes: true });
    const { files, directories } = dirents.reduce((acc, dirent) => {
        dirent.isFile() && acc.files.push(dirent.name);
        dirent.isDirectory() && acc.directories.push(dirent.name);
        return acc;
    }, { files: [], directories: [] });
    const schemaKeys = Object.keys(schemaTree).filter(key => key !== 'sections' && key !== 'pages');
    const definedFilesInSchema = schemaKeys.filter(key => schemaTree[key] instanceof ZodObject);
    const definedFoldersInSchema = schemaKeys.filter(key => !definedFilesInSchema.includes(key));
    const notDefinedFiles = files.filter(file => !definedFilesInSchema.includes(trimFileExtension(file)));
    const notDefinedFolders = directories.filter(folder => !definedFoldersInSchema.includes(folder));
    const pagesSchema = schemaTree['pages'] || rootPagesSchema || z.object({});
    await Promise.all(definedFilesInSchema.map(async (filename) => {
        const fullPath = join(inputDir, filename + '.mdx');
        if (existsSync(fullPath)) {
            const data = await build(await readFile(fullPath, 'utf-8'));
            schemaTree[filename].parse(data.frontmatter);
            structure[filename] = { ...data, path: fullPath };
        }
        else if (!schemaTree[filename].isOptional()) { /* if file was required */
            throw `${fullPath} is not found yet required in schema!`;
        } /* do nothing if it was optional and not found*/
    }));
    await Promise.all(notDefinedFiles.map(async (filename) => {
        const fullPath = join(inputDir, filename);
        const data = await build(await readFile(fullPath, 'utf-8'));
        pagesSchema.parse(data.frontmatter);
        structure['pages'].push({ ...data, path: fullPath });
    }));
    await Promise.all(definedFoldersInSchema.map(async (folder) => {
        const fullPath = join(inputDir, folder);
        structure[folder] = await MakeContent({
            inputDir: fullPath,
            schemaTree: schemaTree[folder],
            build,
            rootPagesSchema: pagesSchema
        });
    }));
    await Promise.all(notDefinedFolders.map(async (folder) => {
        const fullPath = join(inputDir, folder);
        structure['sections'].push(await MakeContent({
            inputDir: fullPath,
            schemaTree: schemaTree['sections'] || { pages: pagesSchema },
            build,
            rootPagesSchema: pagesSchema
        }));
    }));
    return structure;
}
//# sourceMappingURL=makeContent.js.map