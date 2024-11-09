import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {PaginatedUsers} from "../users.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";
import axios, {AxiosResponse} from 'axios';
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
    // return new Promise(resolve => {
    //   setTimeout(() => resolve(this.fakeStore.getSnippetById(id)), DELAY)
    // })

    const response = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data;
  }

  listSnippetDescriptors(page: number,pageSize: number): Promise<PaginatedSnippets> {
    // const response = await axios.post('http://localhost:8082/snippet/text', {
    //
    // })

    const response: PaginatedSnippets = {
      page: page,
      page_size: pageSize,
      count: 20,
      snippets: page == 0 ? this.fakeStore.listSnippetDescriptors().splice(0,pageSize) : this.fakeStore.listSnippetDescriptors().splice(1,2)
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(response), DELAY)
    })
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

  async getTestCases(snippetId: string): Promise<TestCase[]> {
    const response = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${snippetId}/test`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
    console.log(response.data)
    return response.data.testCases;
  }

  async postTestCase(testCase: TestCase, snippetId: string): Promise<TestCase> {
    const id = testCase.testId

    const existence: AxiosResponse<{testCases:TestCase[]}> = await axios.get(`https://taladro.duckdns.org/snippet/snippet/${snippetId}/test`, {
        headers: {
            Authorization: `Bearer ${this.token}`
        }
    });

      const data = {
          name: testCase.name,
          inputs: testCase.inputs ? testCase.inputs : [],
          outputs: testCase.outputs ? testCase.outputs : []
      }

      if (existence.data.testCases) {

        const isAlreadyCreated = existence.data.testCases.map(t => t.testId).some(t => t === id);

        if (isAlreadyCreated) {
            const response = await axios.put(`https://taladro.duckdns.org/snippet/snippet/test/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });

            return response.data;
        }
        else {
            return await this.save(snippetId, data);
        }
    
    }
    else {
          return await this.save(snippetId, data);
      }
  }

    private async save(snippetId: string, data: { outputs: string[]; inputs: string[]; name: string }) {
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
      inputs: test.inputs,
      outputs: test.outputs
    }

    const response = await axios.post(`https://taladro.duckdns.org/snippet/snippet/${snipppetId}/test/run`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data.isValid ? 'success' : 'fail';
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
