import { 
    readdir, 
    readFile, 
    // stat, 
    mkdir,
    writeFile,
    rm
} from "fs/promises";
import { existsSync } from "fs";
import path from "path";

type TransformDirectoryProps = {
    inputDir : string;
    outputDir : string;
    transformation : (file : { 
        name : string;
        content : string;
    }) => Promise<{
        name : string;
        content ?: string; /* if undefined it will be filtered out(file wont be created in output) */
    }>;
    destructive ?: boolean; /* if set to true, it will delete the outputdir if it already exists */
}


export async function TransformDirectory(props : TransformDirectoryProps){
    if(props.destructive){
        if(existsSync(props.outputDir)){
            await rm(props.outputDir, { recursive : true })
        }
    }
    await mkdir(props.outputDir, { recursive : true });
    const _TransformDir = async ({ inputDir, outputDir, transformation } : TransformDirectoryProps) => {
        const directoryItems = await readdir(inputDir, {withFileTypes : true});
        for(const item of directoryItems){
            const inputFullPath = path.join(inputDir, item.name);
            if(item.isDirectory()){
                const outputFullPath = path.join(outputDir, item.name);
                await mkdir(outputFullPath);
                await _TransformDir({ inputDir : inputFullPath, outputDir : outputFullPath, transformation });
            }
            else if(item.isFile()){
                const content = await readFile(inputFullPath, 'utf-8');
                const transformedFile = await transformation({
                    name : item.name,
                    content
                });
                if(!transformedFile.content) continue;
                const outputFullPath = path.join(outputDir, transformedFile.name);
                await writeFile(outputFullPath, transformedFile.content);
            }
        }
    }
    await _TransformDir(props);
}

// export const getDirectoryStructureRecursiveWithTransformation = (dir : string, transformation ?: (dirent :Dirent) => Dirent | null) => {
//     const dirents = readdirSync(dir, {withFileTypes : true});
//     const structure : Directory = { files : [], directories : []};
//     for(let dirent of dirents){
//         let transformedDirent = transformation ? transformation(dirent) : dirent;
//         if(!transformedDirent) continue;
//         if(transformedDirent.isFile())
//             structure['files'].push(transformedDirent.name);      
//         else if(transformedDirent.isDirectory()){
//             structure['directories'].push({
//                 name : transformedDirent.name,
//                 directories : getDirectoryStructureRecursiveWithTransformation(path.join(dir, transformedDirent.name), transformation)
//             });
//         }
//     }
//     return structure;
// }

export const changeFileExtension = (filename : string, newExtension : string) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return (lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod))
            + '.' + newExtension;
}
export const trimFileExtension = (filename : string) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod)
}