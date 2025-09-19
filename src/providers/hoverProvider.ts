import * as vscode from 'vscode';
import { buildFunctionMarkdown, getFunctionInfo, getKeywordInfo } from '../utils/uwscData';

const WORD_PATTERN = /[A-Za-z_][\w]*/;

export class UWSCHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, WORD_PATTERN);
        if (!range) {
            return undefined;
        }

        const word = document.getText(range);
        const functionInfo = getFunctionInfo(word);
        if (functionInfo) {
            const markdown = new vscode.MarkdownString(buildFunctionMarkdown(word.toUpperCase(), functionInfo));
            return new vscode.Hover(markdown, range);
        }

        const keywordInfo = getKeywordInfo(word);
        if (keywordInfo) {
            const markdown = new vscode.MarkdownString(`**${keywordInfo.name}** — ${keywordInfo.label}`);
            return new vscode.Hover(markdown, range);
        }

        return undefined;
    }
}
