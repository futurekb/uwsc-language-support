import * as vscode from 'vscode';
import { buildFunctionMarkdown, buildFunctionSignature, functionList, keywordList, UWSCKeywordCategory } from '../utils/uwscData';

const keywordKindMap: Record<UWSCKeywordCategory, vscode.CompletionItemKind> = {
    keyword: vscode.CompletionItemKind.Keyword,
    constant: vscode.CompletionItemKind.Constant,
    specialVar: vscode.CompletionItemKind.Variable,
    declaration: vscode.CompletionItemKind.Keyword
};

const keywordCompletionItems: vscode.CompletionItem[] = keywordList.map((keyword) => {
    const item = new vscode.CompletionItem(keyword.name, keywordKindMap[keyword.category]);
    item.detail = keyword.label;
    item.documentation = new vscode.MarkdownString(`**${keyword.name}**\n\n${keyword.label}`);
    return item;
});

const functionCompletionItems: vscode.CompletionItem[] = functionList.map(({ name, definition }) => {
    const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
    item.detail = buildFunctionSignature(name, definition);
    item.documentation = new vscode.MarkdownString(buildFunctionMarkdown(name, definition));

    const parameters = definition.parameters ?? [];
    const snippet = new vscode.SnippetString();
    snippet.appendText(`${name}(`);
    parameters.forEach((parameter, index) => {
        if (index > 0) {
            snippet.appendText(', ');
        }
        const placeholderLabel = `${parameter.name}${parameter.optional ? '?' : ''}`;
        snippet.appendPlaceholder(placeholderLabel);
    });
    snippet.appendText(')');
    item.insertText = snippet;
    item.commitCharacters = ['('];

    return item;
});

export class UWSCCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(): vscode.ProviderResult<vscode.CompletionItem[]> {
        return [...keywordCompletionItems, ...functionCompletionItems];
    }
}
