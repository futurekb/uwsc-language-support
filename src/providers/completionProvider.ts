import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// JSONファイルからデータを読み込む関数
function loadJSON(filePath: string) {
    // 相対パスを絶対パスに変換
    const fullPath = path.join(__dirname, '..', 'data', path.basename(filePath));
    console.log('Loading JSON from:', fullPath);
    
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        throw new Error(`File not found: ${fullPath}`);
    }
    const data = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(data);
}

// キーワードと関数のデータを読み込む
const uwscKeywords: { label: string, documentation: string }[] = loadJSON('../data/keywords.json');
console.log('Loaded UWSC Keywords:', JSON.stringify(uwscKeywords, null, 2)); // 整形して出力

const uwscFunctions: { label: string, documentation: string, arguments?: { name: string, description: string, optional?: boolean }[], returns?: string, example?: string, insertText?: string }[] = loadJSON('../data/functions.json');
console.log('Loaded UWSC Functions:', JSON.stringify(uwscFunctions, null, 2)); // 整形して出力

export class UWSCCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        console.log('UWSC Keywords:', JSON.stringify(uwscKeywords, null, 2)); // 整形して出力
        console.log('UWSC Functions:', JSON.stringify(uwscFunctions, null, 2)); // 整形して出力
        const completionItems = [
            ...uwscKeywords.map((keyword: 
                {
                    label: string,
                    documentation: string
                }) => {
                const item = new vscode.CompletionItem(keyword.label, vscode.CompletionItemKind.Keyword);
                item.documentation = new vscode.MarkdownString(keyword.documentation);
                return item;
            }),
            ...uwscFunctions.map((func: 
                {
                    label: string, 
                    documentation: string, 
                    arguments?: { 
                        name: string, 
                        description: string, 
                        optional?: boolean 
                    }[],
                    returns?: string, 
                    example?: string,
                    insertText?: string
                }) => {
                const item = new vscode.CompletionItem(func.label, vscode.CompletionItemKind.Function);
                let documentation = `### ${func.documentation}\n\n`;
                if (func.arguments) {
                    documentation += '#### 引数\n';
                    func.arguments.forEach((arg: { name: string, description: string, optional?: boolean }) => {
                        documentation += `- ${arg.name}: ${arg.description}${arg.optional ? ' (省略可能)' : ''}\n`;
                    });
                }
                if (func.returns) {
                    documentation += `\n#### 戻値\n${func.returns}\n`;
                }
                if (func.example) {
                    documentation += `\n#### 利用例\n\`\`\`\n${func.example}\n\`\`\`\n`;
                }
                item.documentation = new vscode.MarkdownString(documentation);
                if (func.insertText) {
                    item.insertText = new vscode.SnippetString(func.insertText);
                }
                return item;
            })
        ];

        console.log('Completion Items:', JSON.stringify(completionItems.map(item => ({
            label: item.label,
            kind: item.kind,
            documentation: item.documentation
        })), null, 2)); // 整形して出力
        return completionItems;
    }
}