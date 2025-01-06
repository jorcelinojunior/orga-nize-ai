import OpenAI from 'openai';
import fs from 'fs';
import { OPENAI_CONFIG, NewStructureSchema } from '../config';
import { getFormattedTimestamp, unquoteValidJsonKeys } from '../utils';
import type { FlatDree, Message } from '../types';

/**
 * Sends the current directory tree to OpenAI, requesting a rearranged version.
 */
export async function requestNewStructure(
  messages: Message[],
  treeAsText: string
): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    ...OPENAI_CONFIG,
    messages,
    response_format: NewStructureSchema
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('No response received from OpenAI.');

  return content;
}

/**
 * Converts the dree object into a JSON string to send as user content.
 */
export function dreeToUserContent(dreeTree: FlatDree): string {
  return unquoteValidJsonKeys(JSON.stringify(dreeTree, null, 2));
}
