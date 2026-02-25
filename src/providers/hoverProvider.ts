import * as vscode from 'vscode';
import { getUWSCFunctions, getUWSCSymbols } from './completionProvider';

const functionMap = new Map(getUWSCFunctions().map((func) => [func.label.toUpperCase(), func]));
const symbolMap = new Map(getUWSCSymbols().map((symbol) => [symbol.label.toUpperCase(), symbol]));

export class UWSCHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/);
        if (!wordRange) {
            return undefined;
        }

        const word = document.getText(wordRange).toUpperCase();
        const func = functionMap.get(word);
        if (func) {
            const signature = `${func.label}(${func.arguments?.map((arg) => arg.name).join(', ') ?? ''})`;
            const markdown = new vscode.MarkdownString();
            markdown.appendCodeblock(signature, 'uwsc');
            markdown.appendMarkdown(`\n${func.documentation}`);

            if (func.returns) {
                markdown.appendMarkdown(`\n\n**戻り値:** ${func.returns}`);
            }

            return new vscode.Hover(markdown, wordRange);
        }

        const symbol = symbolMap.get(word);
        if (!symbol) {
            return undefined;
        }

        return new vscode.Hover(new vscode.MarkdownString(`**${symbol.label}**\n\n${symbol.documentation}`), wordRange);
    }
}
