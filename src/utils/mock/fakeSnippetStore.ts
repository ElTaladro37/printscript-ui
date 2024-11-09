import {ComplianceEnum, CreateSnippet, Snippet, UpdateSnippet} from '../snippet'
import {v4 as uuid} from 'uuid'
import {PaginatedUsers} from "../users.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: '006ddf0b-e427-4328-9e0b-c9620207ce15',
    name: 'Super Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'pending',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs'
  },
  {
    id: "8c5ec34e-2f47-4540-922e-49a0d5bc6e7c",
    name: 'Extra coool Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'not-compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs'
  },
  {
    id: '8c5ec34e-2f47-4540-922e-49a0d5bc6e7c',
    name: 'Boaring Snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs'
  },
  {
    id: '006ddf0b-e427-4328-9e0b-c9620207ce15',
    name: 'real snippet',
    content: 'let a : number = 5;\nlet b : number = 5;\n\nprintln(a + b);',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs'
  }
]

const paginatedUsers: PaginatedUsers = {
  count: 5,
  page: 1,
  page_size: 10,
  users: [
    {
      name: "Chona",
      id: "1"
    },
    {
      name: "Fede",
      id: "2"
    },
    {
      name: "Mateo",
      id: "3"
    },
    {
      name: "Tomi",
      id: "4"
    },
    {
      name: "Berrets",
      id: "5"
    }
  ]
}

const INITIAL_FORMATTING_RULES: Rule[] = [
  {
    id: '1',
    name: "indentation",
    isActive: true,
    value: 3
  },
  {
    id: '2',
    name: "open-if-block-on-same-line",
    isActive: false,
  },
  {
    id: '3',
    name: "max-line-length",
    isActive: true,
    value: 100
  },
  {
    id: '4',
    name: "no-trailing-spaces",
    isActive: false,
    value: null
  },
  {
    id: '5',
    name: "no-multiple-empty-lines",
    isActive: false,
    value: null,
  }
]

const INITIAL_LINTING_RULES: Rule[] = [
  {
    id: '1',
    name: "no-expressions-in-print-line",
    isActive: true,
    value: null
  },
  {
    id: '2',
    name: "no-unused-vars",
    isActive: true,
    value: null
  },
  {
    id: '3',
    name: "no-undef-vars",
    isActive: false,
    value: null
  },
  {
    id: '4',
    name: "no-unused-params",
    isActive: false,
    value: null
  },
]

const fakeTestCases: TestCase[] = [
  {
    testId: uuid(),
    name: "Test Case 1",
    input: ["A", "B"],
    output: ["C", "D"]
  },
  {
    testId: uuid(),
    name: "Test Case 2",
    input: ["E", "F"],
    output: ["G", "H"]
  },
]

const fileTypes: FileType[] = [
  {
    language: "printScript",
    extension: "prs",
  },
  {
    language: "python",
    extension: "py",
  },
  {
    language: "java",
    extension: "java",
  },
  {
    language: 'golang',
    extension: 'go'
  }
]

export class FakeSnippetStore {
  private readonly snippetMap: Map<string, Snippet> = new Map()
  private readonly testCaseMap: Map<string, TestCase> = new Map()
  private formattingRules: Rule[] = [];
  private lintingRules: Rule[] = [];

  constructor() {
    INITIAL_SNIPPETS.forEach(snippet => {
      this.snippetMap.set('006ddf0b-e427-4328-9e0b-c9620207ce15', snippet)
    })

    fakeTestCases.forEach(testCase => {
      this.testCaseMap.set(testCase.testId, testCase)
    })
    this.formattingRules = INITIAL_FORMATTING_RULES
    this.lintingRules = INITIAL_LINTING_RULES
  }

  listSnippetDescriptors(): Snippet[] {
    return Array.from(this.snippetMap, ([, value]) => value)
  }

  createSnippet(createSnippet: CreateSnippet): Snippet {
    const id = uuid();
    const newSnippet = {
      id,
      compliance: 'compliant' as ComplianceEnum,
      author: 'yo',
      ...createSnippet
    }
    this.snippetMap.set(id, newSnippet)

    return newSnippet
  }

  getSnippetById(id: string): Snippet | undefined {
    return this.snippetMap.get(id)
  }

  updateSnippet(id: string, updateSnippet: UpdateSnippet): Snippet {
    const existingSnippet = this.snippetMap.get(id)

    if (existingSnippet === undefined)
      throw Error(`Snippet with id ${id} does not exist`)

    const newSnippet = {
      ...existingSnippet,
      ...updateSnippet
    }
    this.snippetMap.set(id, newSnippet)

    return newSnippet
  }

  getUserFriends(name: string, page: number, pageSize: number) {
    return {
      ...paginatedUsers,
      page: page,
      pageSize: pageSize,
      users: paginatedUsers.users.filter(x => x.name.includes(name))
    };
  }

  getFormatRules(): Rule[] {
    return this.formattingRules
  }

  getLintingRules(): Rule[] {
    return this.lintingRules
  }

  formatSnippet(snippetContent: string): string {
    return `//Mocked format of snippet :) \n${snippetContent}`
  }

  getTestCases(): TestCase[] {
    return Array.from(this.testCaseMap, ([, value]) => value)
  }

  postTestCase(testCase: Partial<TestCase>): TestCase {
    const id = testCase.testId ?? uuid()
    const newTestCase = {...testCase, testId: id} as TestCase
    this.testCaseMap.set(id,newTestCase)
    return newTestCase
  }

  removeTestCase(id: string): string {
    this.testCaseMap.delete(id)
    return id
  }

  deleteSnippet(id: string): string {
    this.snippetMap.delete(id)
    return id
  }

  testSnippet(): TestCaseResult {
    return Math.random() > 0.5 ? "success" : "fail"
  }

  getFileTypes(): FileType[] {
    return fileTypes
  }

  modifyFormattingRule(newRules: Rule[]): Rule[] {
    this.formattingRules = newRules;
    return newRules;
  }

  modifyLintingRule(newRules: Rule[]): Rule[] {
    this.lintingRules = newRules
    return newRules
  }
}
