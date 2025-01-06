import fs from 'fs';
import path from 'path';

import type { Dree } from 'dree';
import readline from 'readline';
import { FlatDree, Message } from './types';

/**
 * Returns a formatted timestamp.
 */
export function getFormattedTimestamp(): string {
  const now = new Date();
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}-${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Prompts the user and returns their input.
 */
export function askUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Converts a Dree object to a FlatDree object recursively.
 */
export function toFlatDree(directoryTree: Dree): FlatDree {
  const { name, relativePath, type, children } = directoryTree;

  return {
    name,
    type,
    sourceRelativePath: relativePath,
    children: children?.map(toFlatDree),
  };
}

/**
 * Removes quotes from property names in a JSON string if the property name is valid without quotes.
 * Valid property names are those that conform to JavaScript identifier naming rules.
 *
 * @param jsonString - The JSON string to process.
 * @returns A string with unquoted valid property names.
 * @example
  * unquoteValidJsonKeys('{ "name": "Alice", "age": 30, "1": "one" }') // { name: "Alice", age: 30, "1": "one" }
  * unquoteValidJsonKeys('{ "order id": 123, "customer name": "Bob" }') // { "order id": 123, "customer name": "Bob" }
 */
export function unquoteValidJsonKeys(jsonString: string): string {
  const regex = /"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g;
  return jsonString.replace(regex, '$1:');
}

/**
 * Gets the name of the innermost folder from a given path.
 * @param dirPath - The full or relative directory path.
 * @returns The name of the last folder in the path, or null if the path is invalid or points to a file.
 */
export function getInnermostFolderName(dirPath: string): string | null {
  const resolvedPath = path.resolve(dirPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error("Path does not exist:", resolvedPath);
    return null;
  }
  const stats = fs.statSync(resolvedPath);
  if (stats.isFile()) return path.basename(path.dirname(resolvedPath));
  if (stats.isDirectory()) return path.basename(resolvedPath);
  return null;
}

/**
 * Saves the messages log to a file.
 * @param messages - The messages to save.
 * @param filename - The name of the file to save the messages to.
 */
export function saveMessagesLog(messages: Message[], filename?: string): void {
  const logs = messages.map(msg => {
    if (msg.role === 'assistant') {
      try {
        return {
          role: msg.role,
          content: typeof msg.content === 'string'
            ? JSON.parse(msg.content || '{}')
            : msg.content?.map((c: any) => c.text || c.refusal).join(' ')
         }
      } catch {
        return { role: msg.role, content: msg.content };
      }
    }
    return msg;
  });

  fs.writeFileSync(
    path.join(process.cwd(), `/_logs/${filename ?? `msgs-${getFormattedTimestamp()}.json`}`),
    JSON.stringify(logs, null, 2),
    'utf-8'
  );
}