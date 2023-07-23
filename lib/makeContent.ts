import { ZodTypeAny, TransformTree, ArchetypeTree, Page, MakeContentProps } from './types';
import { ZodObject } from 'zod';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { trimFileExtension } from './utils';
import { existsSync } from 'fs';

export async function makeContent<T extends ArchetypeTree, U extends ZodTypeAny>
({ inputDir, schemaTree , build, rootPagesSchema } : MakeContentProps<T, U>) : Promise<TransformTree<T, U>>
{
  const structure : any = { 
    path : inputDir,
    pages : [] as Page[],
    sections : [] as Record<string, any>[]
  };
  const dirents = await readdir(inputDir, {withFileTypes : true});
  const {files, directories} = dirents.reduce((acc, dirent) => {
    dirent.isFile() && acc.files.push(dirent.name);
    dirent.isDirectory() && acc.directories.push(dirent.name);
    return acc;
  }, { files : [] as string[], directories : [] as string[] });
  
  const schemaKeys = Object.keys(schemaTree).filter(key => key !== 'sections' && key !== 'pages');
  const definedFilesInSchema = schemaKeys.filter(key => schemaTree[key] instanceof ZodObject);
  const definedFoldersInSchema = schemaKeys.filter(key => !definedFilesInSchema.includes(key));
  const notDefinedFiles = files.filter(file => !definedFilesInSchema.includes(trimFileExtension(file)));
  const notDefinedFolders = directories.filter(folder => !definedFoldersInSchema.includes(folder));
  
  const pagesSchema = schemaTree['pages'] || rootPagesSchema;
  
  await Promise.all(
    definedFilesInSchema.map(async filename => {
      const fullPath = join(inputDir, filename + '.mdx');
      if(existsSync(fullPath)){
        const data = await build(await readFile(fullPath, 'utf-8'));
        (schemaTree[filename] as ZodTypeAny).parse(data.frontmatter);
        structure[filename] = { ...data, path : fullPath};
      }else if(!(schemaTree[filename] as ZodTypeAny).isOptional()){ /* if file was required */
         throw `${fullPath} is not found yet required in schema!`;
      } /* do nothing if it was optional and not found*/
    })
  );

  await Promise.all(
    notDefinedFiles.map(async filename => {
      const fullPath = join(inputDir, filename);
      const data = await build(await readFile(fullPath, 'utf-8'));
      pagesSchema.parse(data.frontmatter);
      structure['pages'].push({...data, path : fullPath});
    })
  );

  await Promise.all(    
    definedFoldersInSchema.map(async folder => {
      const fullPath = join(inputDir, folder);
      structure[folder] = await makeContent({
        inputDir : fullPath,
        schemaTree : schemaTree[folder] as ArchetypeTree,
        build,
        rootPagesSchema : pagesSchema
      });
    })
  );
  
  await Promise.all(
    notDefinedFolders.map(async folder => {
      const fullPath = join(inputDir, folder);
      structure['sections'].push(await makeContent({
        inputDir : fullPath,
        schemaTree : schemaTree['sections'] || { pages : pagesSchema },
        build,
        rootPagesSchema : pagesSchema
      }));
    })
  );

  return structure;
}