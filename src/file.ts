/**
 * File module for RandBox.js
 * Contains file generation functions
 */

import { RandBox, initOptions } from "./core.js";

export function file(this: RandBox, options?: any): string {
    var fileOptions = options || {};
    var poolCollectionKey = "fileExtension";
    var typeRange = Object.keys(this.get("fileExtension")); //['raster', 'vector', '3d', 'document'];
    var fileName: string;
    var fileExtension: string;

    // Generate random file name
    fileName = this.word({length: fileOptions.length});

    // Generate file by specific extension provided by the user
    if (fileOptions.extension) {
        fileExtension = fileOptions.extension;
        return (fileName + '.' + fileExtension);
    }

    // Generate file by specific extension collection
    if (fileOptions.extensions) {
        if (Array.isArray(fileOptions.extensions)) {
            fileExtension = this.pickone(fileOptions.extensions);
            return (fileName + '.' + fileExtension);
        }
        else if (fileOptions.extensions.constructor === Object) {
            var extensionObjectCollection = fileOptions.extensions;
            var keys = Object.keys(extensionObjectCollection);

            fileExtension = this.pickone(extensionObjectCollection[this.pickone(keys)]);
            return (fileName + '.' + fileExtension);
        }

        throw new Error("RandBox: Extensions must be an Array or Object");
    }

    // Generate file extension based on specific file type
    if (fileOptions.fileType) {
        var fileType = fileOptions.fileType;
        if (typeRange.indexOf(fileType) !== -1) {
            fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
            return (fileName + '.' + fileExtension);
        }

        throw new RangeError("RandBox: Expect file type value to be 'raster', 'vector', '3d' or 'document'");
    }

    // Generate random file name if no extension options are passed
    fileExtension = this.pickone(this.get(poolCollectionKey)[this.pickone(typeRange)]);
    return (fileName + '.' + fileExtension);
}

/**
 * Generates file data of random bytes using the chance.file method for the file name
 *
 * @param {object}
 * fileName: String
 * fileExtention: String
 * fileSize: Number      <- in bytes
 * @returns {object} fileName: String, fileData: Buffer
 */
export function fileWithContent(this: RandBox, options?: any): {fileData: any, fileName: string} {
    var fileOptions = options || {};
    var fileName = 'fileName' in fileOptions ? fileOptions.fileName : this.file().split(".")[0];
    fileName += "." + ('fileExtension' in fileOptions ? fileOptions.fileExtension : this.file().split(".")[1]);

    if (typeof fileOptions.fileSize !== "number") {
        throw new Error('File size must be an integer');
    }
    var file = {
        fileData: this.buffer({length: fileOptions.fileSize}),
        fileName: fileName,
    };
    return file;
}

// Export collection for easy prototype extension
export const file_module = {
    file,
    fileWithContent
};
