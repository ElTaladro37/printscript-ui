import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {PaginatedUsers, User} from "../users.ts";
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

    const response = await axios.post('https://taladro.duckdns.org/snippet/snippet/text', data, {
      headers: {
        Authorization: `Bearer ${this.token }`
      }
    });

    console.log(response.data)
    return response.data;
  }

  async getSnippetById(id: string): Promise<Snippet | undefined> {

    const response = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

    async listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
        try {
            const response = await axios.get('https://taladro.duckdns.org/snippet/snippets/all', {
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

    const response = await axios.put(`https://taladro.duckdns.org/snippet/snippet/${id}/text`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async getUserFriends(name: string = "", page: number = 1, pageSize: number = 10): Promise<PaginatedUsers> {
      try {
          const response = await axios.get('https://taladro.duckdns.org/snippet/user', {
              params: {
                  page: page - 1,
                  size: pageSize,
              },
              headers: {
                  Authorization: `Bearer ${this.token}`
              }
          });

          const users: User[] = response.data.map((user: any) => ({
              id: user.user_id,
              name: user.email,
              email: user.email,
          }));

          return {
              page: page,
              page_size: pageSize,
              count: users.length,
              users: users
          };
      } catch (error) {
          console.error("Error al obtener usuarios:", error);
          throw error;
      }
  }

  async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
      try {
          const response = await axios.post(
              `https://taladro.duckdns.org/snippet/${snippetId}/share`,
              userId,
              {headers: {Authorization: `Bearer ${this.token}`}}
          );

          console.log(`Snippet ${snippetId} shared with user ${userId}`);
          return response.data.snippetId;
      } catch (error) {
          console.error(`Error sharing snippet ${snippetId} with user ${userId}:`, error);
          throw error;
      }
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
    const response = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${snippetId}/test`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
    console.log(response.data)
    return response.data;
  }

  async postTestCase(testCase: TestCase, snippetId: string): Promise<TestCase> {
    const id = testCase.id

    const existance = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${snippetId}/test`, {
        headers: {
            Authorization: `Bearer ${this.token}`
        }
    });

    if (existance.data.testcases){
      const data = {
        name: testCase.name,
        inputs: testCase.input? testCase.input : [],
        outputs: testCase.output? testCase.output : []
      }

      const response = await axios.put(`https://taladro.duckdns.org/snippet/snippet/test/${id}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      return response.data;
    }
    const data = {
      name: testCase.name,
      inputs: testCase.input? testCase.input : [],
      outputs: testCase.output? testCase.output : []
    }

    const response = await axios.post(`https://taladro.duckdns.org/snippet/snippet/${snippetId}/test`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async removeTestCase(id: string): Promise<string> {
    const response = await axios.delete(`https://taladro.duckdns.org/snippet/snippet/test/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async testSnippet(test: TestCase, snipppetId: string): Promise<TestCaseResult> {
    const data = {
      name: test.name,
      input: test.input,
      output: test.output
    }

    const response = await axios.post(`https://taladro.duckdns.org/snippet/snippet/${snipppetId}/test`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  async deleteSnippet(id: string): Promise<string> {
    const response = await axios.delete(`https://taladro.duckdns.org/snippet/snippet/${id}`, {
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

  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    const response = await axios.put(`https://taladro.duckdns.org/snippet/snippet/format`, newRules, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })

    return response.data;
  }

  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    const dto = {
      rules: newRules,
      language: "printScript",
      version: "1.1"
    }
    const response = await axios.put(`https://taladro.duckdns.org/snippet/lint-rules`, dto, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })

    return response.data;
  }
}
