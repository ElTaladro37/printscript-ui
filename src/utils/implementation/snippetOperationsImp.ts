// import {SnippetOperations} from "../snippetOperations.ts";
// import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../snippet.ts";
// import {FileType} from "../../types/FileType.ts";
// import {Rule} from "../../types/Rule.ts";
// import {TestCase} from "../../types/TestCase.ts";
// import {TestCaseResult} from "../queries.tsx";
// import {PaginatedUsers} from "../users.ts";
// import {useAuth0} from "@auth0/auth0-react";
// import * as axios from "axios";
//
// export class snippetOperationImp implements SnippetOperations{
//     createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
//         const token = useAuth0()
//
//         const data = {
//             name: createSnippet.name,
//             description: "description",
//             language: createSnippet.language,
//             version: "1.1",
//             snippetFile: createSnippet.content
//         }
//
//
//         const response = await axios.post('http://localhost:8080/snippet/text', data)
//
//     }
//
//     deleteSnippet(id: string): Promise<string> {
//         return Promise.resolve("");
//     }
//
//     formatSnippet(snippet: string): Promise<string> {
//         return Promise.resolve("");
//     }
//
//     getFileTypes(): Promise<FileType[]> {
//         return Promise.resolve([]);
//     }
//
//     getFormatRules(): Promise<Rule[]> {
//         return Promise.resolve([]);
//     }
//
//     getLintingRules(): Promise<Rule[]> {
//         return Promise.resolve([]);
//     }
//
//     getSnippetById(id: string): Promise<Snippet | undefined> {
//         return Promise.resolve(undefined);
//     }
//
//     getTestCases(snippetId: string): Promise<TestCase[]> {
//         return Promise.resolve([]);
//     }
//
//     getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
//         return Promise.resolve(undefined);
//     }
//
//     listSnippetDescriptors(page: number, pageSize: number, sippetName?: string): Promise<PaginatedSnippets> {
//         return Promise.resolve(undefined);
//     }
//
//     modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
//         return Promise.resolve([]);
//     }
//
//     modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
//         return Promise.resolve([]);
//     }
//
//     postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
//         return Promise.resolve(undefined);
//     }
//
//     removeTestCase(id: string): Promise<string> {
//         return Promise.resolve("");
//     }
//
//     shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
//         return Promise.resolve(undefined);
//     }
//
//     testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
//         return Promise.resolve(undefined);
//     }
//
//     updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
//         return Promise.resolve(undefined);
//     }
//
// }