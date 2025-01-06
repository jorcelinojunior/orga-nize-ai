import { FlatDree, FlatDreeSuggestion } from "../types";
import { type Dree, Type } from "dree";

/**
 * A simple function to print the new structure as a tree.
 * This is optional; you can also rely on dree.parse or parseTree if desired.
 */
export function printTreeStructure(node: FlatDree | FlatDreeSuggestion, indent = '', isLast = true): void {
  const prefix = isLast ? '└── ' : '├── ';
  console.log(`${indent}${prefix}${node.name}`);

  const newIndent = indent + (isLast ? '    ' : '│   ');
  if (node.type === Type.DIRECTORY && Array.isArray(node.children)) {
    node.children.forEach((child: any, index: number) => {
      const isChildLast = node.children?.length ? index === node.children.length - 1 : true;
      printTreeStructure(child, newIndent, isChildLast);
    });
  }
}
