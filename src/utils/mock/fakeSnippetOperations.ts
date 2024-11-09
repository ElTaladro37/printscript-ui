import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {PaginatedUsers} from "../users.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import axios from 'axios';
const DELAY: number = 1000

export class FakeSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore()
  private readonly token: string;

  constructor(token: string) {
    autoBind(this)
    this.token = token;
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const data = {
      name: createSnippet.name,
      description: "description",
      language: createSnippet.language,
      version: "1.1",
      snippetFile: createSnippet.content
    };

    const response = await axios.post('http://localhost:8082/snippet/text', data, {
      headers: {
        Authorization: `Bearer ${this.token }`
      }
    });

    console.log(response.data)
    return response.data;
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {

    const response = await axios.get(`http://localhost:8082/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

    async listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
        try {
            const response = await axios.get('http://localhost:8082/snippets/all', {
                params: {
                    page: page,
                    size: pageSize,
                    owner: true,
                    share: true
                },
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });

            const snippets: Snippet[] = response.data.map((item: any) => ({
                snippetId: item.snippetId,
                name: item.name,
                description: item.description,
                language: item.language,
                version: item.version,
                snippetFile: item.snippetFile
            }));

            return {
                page: page,
                page_size: pageSize,
                count: snippets.length,
                snippets: snippets
            };
        } catch (error) {
            console.error("Error al obtener snippets:", error);
            throw error;
        }
    }

  async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
    const data = {
      snippetFile: updateSnippet.content,
      name: updateSnippet.name,
      language: updateSnippet.language?? "printScript",
      version: updateSnippet.extension?? "1.1",
      description: "esto nose que es"
    }

    const response = await axios.put(`http://localhost:8082/snippet/${id}/text`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getUserFriends(name,page,pageSize)), DELAY)
    })
  }

  shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
    return new Promise(resolve => {
      console.log(userId)
      // @ts-expect-error, it will always find it in the fake store
      setTimeout(() => resolve(this.fakeStore.getSnippetById(snippetId)), DELAY)
    })
  }

  getFormatRules(): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFormatRules()), DELAY)
    })
  }

  getLintingRules(): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getLintingRules()), DELAY)
    })
  }

  formatSnippet(snippetContent: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.formatSnippet(snippetContent)), DELAY)
    })
  }

  async getTestCases(snippetId: String): Promise<TestCase[]> {
    const response = await axios.get(`http://localhost:8082/snippet/test/${snippetId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async postTestCase(testCase: TestCase): Promise<TestCase> {
    const id = testCase.id

    const existance = await axios.get(`http://localhost:8082/snippet/test/${id}`, {
        headers: {
            Authorization: `Bearer ${this.token}`
        }
    });

    if (existance.data){
      const data = {
        id: id,
        name: testCase.name,
        input: testCase.input,
        output: testCase.output
      }

      const response = await axios.put(`http://localhost:8082/snippet/test}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return response.data;
    }
    const data = {
      name: testCase.name,
      input: testCase.input,
      output: testCase.output
    }

    const response = await axios.post(`http://localhost:8082/snippet/test}`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async removeTestCase(id: string): Promise<string> {
    const response = await axios.delete(`http://localhost:8082/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async testSnippet(test: TestCase): Promise<TestCaseResult> {
    const data = {
      id: test.id,
      input: test.input,
      output: test.output
    }

    const response = await axios.post(`http://localhost:8082/snippet/test}`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async deleteSnippet(id: string): Promise<string> {
    const response = await axios.delete(`http://localhost:8082/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  getFileTypes(): Promise<FileType[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFileTypes()), DELAY)
    })
  }

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.modifyFormattingRule(newRules)), DELAY)
    })
  }

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.modifyLintingRule(newRules)), DELAY)
    })
  }
}
