import * as vscode from 'vscode';
import { getUWSCFunctions } from './completionProvider';

const functionMap = new Map(getUWSCFunctions().map((func) => [func.label.toUpperCase(), func]));

export class UWSCSignatureHelpProvider implements vscode.SignatureHelpProvider {
    provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.SignatureHelp> {
        const linePrefix = document.lineAt(position.line).text.slice(0, position.character);
        const match = /([A-Za-z_][A-Za-z0-9_]*)\s*\(([^()]*)$/.exec(linePrefix);
        if (!match) {
            return undefined;
        }

        const functionName = match[1].toUpperCase();
        const argsText = match[2];
        const func = functionMap.get(functionName);
        if (!func) {
            return undefined;
        }

        const signature = new vscode.SignatureHelp();
        const sigInfo = new vscode.SignatureInformation(
            `${func.label}(${func.arguments?.map((arg) => arg.name).join(', ') ?? ''})`,
            func.documentation
        );

        const parameters = func.arguments ?? [];
        sigInfo.parameters = parameters.map((arg) => new vscode.ParameterInformation(arg.name, arg.description));

        const activeParameter = Math.min(argsText.split(',').length - 1, Math.max(parameters.length - 1, 0));

        signature.signatures = [sigInfo];
        signature.activeSignature = 0;
        signature.activeParameter = Math.max(activeParameter, 0);

        return signature;
    }
}
