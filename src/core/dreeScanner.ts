import { scan } from 'dree';
import type { ScanOptions, Dree } from 'dree';
import { toFlatDree } from '../utils';
import { FlatDree } from '../types';

/**
 * Scans a directory with dree and returns the tree object.
 */
export function scanSourceDirectory(sourcePath: string, options?: ScanOptions): FlatDree {
  const defaultOptions: ScanOptions = {
    stat: false,
    normalize: true,
    symbolicLinks: true,
    followLinks: false,
    showHidden: true,
    sizeInBytes: false,
    size: false,
    hash: false,
    excludeEmptyDirectories: true,
    descendants: false,
    depth: undefined,
    exclude: undefined,
    extensions: undefined,
  };

  const directoryTree : Dree = scan(sourcePath, { ...defaultOptions, ...options });

  return toFlatDree(directoryTree);
}
