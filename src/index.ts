import path from 'path';
import fs from 'fs';
import { scanSourceDirectory } from './core/dreeScanner';
import { handleStructureInteraction } from './core/userInteraction';
import type { Message } from './types';
import { printTreeStructure } from './core/structurePrinter';

const sourceDirectory = path.resolve(__dirname, process.env.SOURCE_DIR || './_example/source');
const targetDirectory = path.resolve(__dirname, process.env.TARGET_DIR || './_example/target');
const messages: Message[] = [];

(async () => {
  try {
    if (!fs.existsSync(sourceDirectory))
      throw new Error(`Source directory "${sourceDirectory}" does not exist.`);

    // Scan the source directory using dree
    const sourceTree = scanSourceDirectory(sourceDirectory);

    console.log('\n--- Source Directory (Before Organization) ---');
    printTreeStructure(sourceTree);
    console.log('------------------------------\n');

    // Ensure the target directory exists
    if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory, { recursive: true });

    // Start interaction loop
    await handleStructureInteraction(sourceTree, messages, sourceDirectory, targetDirectory);
  } catch (error) {
    console.error('Error processing files:', error instanceof Error ? error.message : error);
  }
})();
