import { SYSTEM_PROMPT, USER_PROMPT_GENERATE, USER_PROMPT_GENERATE_AGAIN } from '../config';
import { askUser, getFormattedTimestamp, getInnermostFolderName, saveMessagesLog } from '../utils';
import { applyNewStructure } from './structureApplier';
import { dreeToUserContent, requestNewStructure } from './structureGenerator';
import { printTreeStructure } from './structurePrinter';
import type { FlatDree, FlatDreeSuggestion, Message } from '../types';

/**
 * Handles the interaction loop:
 *  - Show the user the newly proposed structure
 *  - Ask if they want to accept (apply), regenerate, or exit
 */
export async function handleStructureInteraction(
  sourceTree: FlatDree,
  messages: Message[],
  sourceDirectory: string,
  targetDirectory: string
): Promise<void> {
  let newStructureJSON: string;

  messages.push({ role: 'system', content: SYSTEM_PROMPT });

  const getPrompt = () =>
    messages.length === 1
      ? USER_PROMPT_GENERATE(dreeToUserContent(sourceTree), getInnermostFolderName(targetDirectory))
      : USER_PROMPT_GENERATE_AGAIN;

  while (true) {
    const prompt = getPrompt();
    messages.push({ role: 'user', content: prompt });

    try {
      newStructureJSON = await requestNewStructure(messages, dreeToUserContent(sourceTree));

      messages.push({ role: 'assistant', content: newStructureJSON });

      if (process.env.NODE_ENV === 'development')
        saveMessagesLog([messages.pop() as Message], `${getFormattedTimestamp()}.json`);
    } catch (err) {
      console.error('Error requesting new structure:', err);
      return;
    }

    let newStructure: FlatDreeSuggestion;
    try {
      newStructure = JSON.parse(newStructureJSON);
    } catch (err) {
      console.error('Invalid JSON received:', err);
      return;
    }

    console.log('\n--- Proposed New Structure ---');
    printTreeStructure(newStructure);
    console.log('------------------------------\n');

    const answer = (await askUser('Choose an option: [A]ccept, [G]enerate again, [E]xit: '))
      .toLowerCase()
      .trim();

    if (answer === 'a') {
      applyNewStructure(newStructure, sourceDirectory, targetDirectory);
      console.log('Files successfully reorganized.');

      if (process.env.NODE_ENV === 'development') saveMessagesLog(messages);

      process.exit(0);
    } else if (answer === 'g') {
      console.log('\nGenerating a new suggestion...\n');
    } else if (answer === 'e') {
      console.log('Exiting without applying the new structure.');
      if (process.env.NODE_ENV === 'development') saveMessagesLog(messages);

      process.exit(0);
    } else {
      console.log('Invalid option. Please choose [A], [G], or [E].\n');
    }
  }
}
