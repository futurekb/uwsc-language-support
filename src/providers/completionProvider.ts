import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface UWSCKeyword {
    label: string;
    documentation: string;
}

interface UWSCSymbol {
    label: string;
    detail?: string;
    documentation: string;
}

interface UWSCArgument {
    name: string;
    description: string;
    optional?: boolean;
}

interface UWSCFunction extends UWSCSymbol {
    arguments?: UWSCArgument[];
    returns?: string;
    example?: string;
    insertText?: string;
}

function loadJSON<T>(relativePath: string): T {
    const fullPath = path.join(__dirname, '..', 'data', relativePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data) as T;
}

const uwscKeywords = loadJSON<UWSCKeyword[]>('keywords.json');
const uwscFunctions = loadJSON<UWSCFunction[]>('functions.json');
const uwscConstants = loadJSON<UWSCSymbol[]>('constants.json');
const uwscOptions = loadJSON<UWSCSymbol[]>('options.json');

function buildFunctionDocumentation(func: UWSCFunction): vscode.MarkdownString {
    let documentation = `### ${func.documentation}\n\n`;

    if (func.arguments?.length) {
        documentation += '#### 引数\n';
        func.arguments.forEach((arg) => {
            documentation += `- \`${arg.name}\`: ${arg.description}${arg.optional ? '（省略可）' : ''}\n`;
        });
    }

    if (func.returns) {
        documentation += `\n#### 戻り値\n${func.returns}\n`;
    }

    if (func.example) {
        documentation += `\n#### 例\n\`\`\`uwsc\n${func.example}\n\`\`\``;
    }

    return new vscode.MarkdownString(documentation);
}

function buildSymbolDocumentation(symbol: UWSCSymbol): vscode.MarkdownString {
    const parts = [`### ${symbol.label}`];
    if (symbol.detail) {
        parts.push(`\n${symbol.detail}`);
    }
    parts.push(`\n\n${symbol.documentation}`);
    return new vscode.MarkdownString(parts.join(''));
}

export class UWSCCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(): vscode.ProviderResult<vscode.CompletionItem[]> {
        const keywordItems = uwscKeywords.map((keyword) => {
            const item = new vscode.CompletionItem(keyword.label, vscode.CompletionItemKind.Keyword);
            item.detail = 'UWSC キーワード';
            item.documentation = new vscode.MarkdownString(keyword.documentation);
            return item;
        });

        const functionItems = uwscFunctions.map((func) => {
            const item = new vscode.CompletionItem(func.label, vscode.CompletionItemKind.Function);
            item.detail = func.detail ?? 'UWSC 関数';
            item.documentation = buildFunctionDocumentation(func);
            item.insertText = new vscode.SnippetString(func.insertText ?? `${func.label}($0)`);
            return item;
        });

        const constantItems = uwscConstants.map((constant) => {
            const item = new vscode.CompletionItem(constant.label, vscode.CompletionItemKind.Constant);
            item.detail = constant.detail ?? 'UWSC 定数';
            item.documentation = buildSymbolDocumentation(constant);
            return item;
        });

        const optionItems = uwscOptions.map((option) => {
            const item = new vscode.CompletionItem(option.label, vscode.CompletionItemKind.EnumMember);
            item.detail = option.detail ?? 'UWSC OPTION 項目';
            item.documentation = buildSymbolDocumentation(option);
            return item;
        });

        return [...keywordItems, ...functionItems, ...constantItems, ...optionItems];
    }
}

export function getUWSCFunctions(): UWSCFunction[] {
    return uwscFunctions;
}

export function getUWSCSymbols(): UWSCSymbol[] {
    return [...uwscConstants, ...uwscOptions, ...uwscKeywords];
}
