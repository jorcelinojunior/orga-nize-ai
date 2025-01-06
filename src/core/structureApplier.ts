import { Type } from 'dree';
import fs from 'fs';
import path from 'path';
import { FlatDreeSuggestion } from '../types';

/**
 * Recursively applies the new structure by copying files
 * from 'sourceRelativePath' to 'targetRelativePath'.
 */
export function applyNewStructure(
  node: FlatDreeSuggestion,
  sourceDirectory: string,
  targetDirectory: string
): void {
  if (node.type === Type.FILE) {
    const sourceFullPath = path.join(sourceDirectory, node.sourceRelativePath);
    const targetFullPath = path.join(targetDirectory, node.targetRelativePath);

    // Ensure the parent directory of the target file path exists
    fs.mkdirSync(path.dirname(targetFullPath), { recursive: true });

    if (fs.existsSync(sourceFullPath)) {
      fs.copyFileSync(sourceFullPath, targetFullPath);
      console.log(`Copied file from "${node.sourceRelativePath}" to "${node.targetRelativePath}"`);
    } else {
      console.warn(`Source file not found: "${sourceFullPath}"`);
    }

    return;
  }

  if (node.type === Type.DIRECTORY) {
    const dirFullPath = path.join(targetDirectory, node.targetRelativePath);

    // Create the directory (if it doesn't already exist)
    fs.mkdirSync(dirFullPath, { recursive: true });

    // Recurse over any children
    if (Array.isArray(node.children)) {
      node.children.forEach(child => {
        applyNewStructure(child, sourceDirectory, targetDirectory);
      });
    }
  }
}
