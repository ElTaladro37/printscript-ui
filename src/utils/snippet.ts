import {Pagination} from "./pagination.ts";
import {FileType} from "../types/FileType.ts";

export type ComplianceEnum =
    string


export type CreateSnippet = {
  name: string;
  content: string;
  language: string;
  extension: string;
}

export type CreateSnippetWithLang = CreateSnippet & { language: string }

export type UpdateSnippet = {
  content: string;
  name: string;
  language: string;
  extension: string;
}

export type Snippet = CreateSnippet & {
  snippetId: string
} & SnippetStatus

type SnippetStatus = {
  compliance: ComplianceEnum;
  author: string;
}
export type PaginatedSnippets = Pagination & {
  snippets: Snippet[]
}

export const getFileLanguage = (fileTypes: FileType[], fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.extension == fileExt)
}