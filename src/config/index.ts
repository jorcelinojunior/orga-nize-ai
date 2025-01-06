import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import type { Nullable, ResponseFormat } from '../types';

export const OPENAI_CONFIG: Omit<ChatCompletionCreateParamsBase, 'messages' | 'stream'> = {
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18',
  temperature: 1,
  max_tokens: 16383,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
};

export const NewStructureSchema: ResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'new_structure',
    strict: false,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        sourceRelativePath: { type: 'string' },
        targetRelativePath: { type: 'string' },
        type: { type: 'string', enum: ['directory'] },
        children: {
          type: 'array',
          description: 'An array of objects representing the children of the current directory',
          items: { $ref: '#/definitions/treeNode' }
        }
      },
      required: ['name', 'targetRelativePath', 'sourceRelativePath', 'type', 'children'],
      additionalProperties: false,
      definitions: {
        treeNode: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            sourceRelativePath: { type: 'string', description: 'The original path of this file, can be empty string for directories' },
            targetRelativePath: { type: 'string', description: 'The new path where this file should copy to, can be empty string for directories' },
            type: { type: 'string', enum: ['file', 'directory'] },
            children: {
              type: 'array',
              description: 'An array of objects representing the children of the current directory, only for directories',
              items: { $ref: '#/definitions/treeNode' }
            }
          },
          required: ['name', 'sourceRelativePath', 'targetRelativePath', 'type', 'children'],
          additionalProperties: false
        }
      }
    }
  }
};

export const SYSTEM_PROMPT = `
You are an expert in file organization.
Your task is to analyze the current organization of a user's folders and files and suggest a new, more organized, and efficient structure without missing any files—this is very important!
You will receive a JSON object that describes the current directory tree structure of the source folder.
Each object has the following properties:
- **name**: the name of the file or directory;
- **type**: the type of the object, which can be "file" or "directory";
- **sourceRelativePath**: the relative path of the file or directory in relation to the source folder;
- **children**: an array of objects representing the children of the current directory (for directories only); it has the same structure as the parent object.

Return the same structure of the JSON schema, but fully reorganized and adding a new property (only for files) called **targetRelativePath**, which represents the relative path of the file in relation to the new destination folder.
- targetRelativePath: the relative path of the file in relation to the new destination folder;

**Note**:
  - The new organization you suggest will not modify the source folders and files;
  - Your suggestion will be used to create a new destination folder, initially empty, where all the files from the source folder will be copied based on the organization you suggest (this is just for context; you only need to focus on suggesting the new structure);
  - This ensures that the source folder remains untouched.

## Instructions
  1. The tree you generate must follow the format: { name, sourceRelativePath, targetRelativePath, type, children[] }; children[] is an array of objects with the same structure.
  2. If the "type" of the node is "file", "sourceRelativePath" must exist; "targetRelativePath" must exist; "children" must be empty/not exist.
  3. If the "type" of the node is "directory", "children" must exist; "sourceRelativePath" must be an empty string; "targetRelativePath" must be an empty string.
  4. Do not remove or rename any existing files; just reorganize them into the new suggested directories.
  5. Do not invent files that do not exist;
  6. Do not omit any files;
  7. Never place the same file in more than one directory;
  8. Do not create empty directories; if a directory does not have any files, do not include it in the new organization;
  9. If a new version is requested, always base it on the original input to suggest a version different from any previously suggested;
  10. Return only valid JSON, without additional comments.
`;

export const USER_PROMPT_GENERATE = (treeString: string, targetFolder: Nullable<string>) => `
Below is the directory tree of the source folder in JSON format:

\`\`\`json
${treeString}
\`\`\`

Please propose a new organization.
Remember not to omit or rename anything, but you may reorganize directories and their children if desired.
${targetFolder?.length ? `Use the destination root folder "${targetFolder}" as a reference for the new organization.` : ''}
`;

export const USER_PROMPT_GENERATE_AGAIN = `
Suggest a different version from those previously suggested, always based on the original directory tree.
`;
