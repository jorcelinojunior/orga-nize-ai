import type { Dree } from "dree";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

export type Nullable<T> = T | null | undefined;

export type ResponseFormat = ChatCompletionCreateParamsBase["response_format"];

export type Message =
  | ChatCompletionSystemMessageParam
  | ChatCompletionUserMessageParam
  | ChatCompletionAssistantMessageParam;

export type FlatDree = Pick<Dree, "name" | "type"> & {
  sourceRelativePath: string;
  children?: FlatDree[];
};

export type FlatDreeSuggestion = Pick<Dree, "name" | "type"> & {
  sourceRelativePath: string;
  targetRelativePath: string;
  children?: FlatDreeSuggestion[];
};
