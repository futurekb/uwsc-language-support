import * as vscode from 'vscode';
import { buildFunctionSignature, getFunctionInfo } from '../utils/uwscData';

export class UWSCSignatureHelpProvider implements vscode.SignatureHelpProvider {
    provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.SignatureHelp> {
        const textBeforePosition = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
        const openParenIndex = textBeforePosition.lastIndexOf('(');
        if (openParenIndex === -1) {
            return undefined;
        }

        const functionMatch = /([A-Za-z_][\w]*)\s*$/.exec(textBeforePosition.slice(0, openParenIndex));
        if (!functionMatch) {
            return undefined;
        }

        const functionName = functionMatch[1];
        const functionInfo = getFunctionInfo(functionName);
        if (!functionInfo) {
            return undefined;
        }

        const normalizedName = functionName.toUpperCase();
        const signatureHelp = new vscode.SignatureHelp();
        const signatureInfo = new vscode.SignatureInformation(
            buildFunctionSignature(normalizedName, functionInfo),
            functionInfo.description
        );

        const parameters = functionInfo.parameters ?? [];
        signatureInfo.parameters = parameters.map((parameter) => {
            const label = parameter.optional ? `[${parameter.name}]` : parameter.name;
            const details: string[] = [];
            if (parameter.type) {
                details.push(`(${parameter.type})`);
            }
            if (parameter.description) {
                details.push(parameter.description);
            }
            return new vscode.ParameterInformation(label, details.join(' '));
        });

        signatureHelp.signatures = [signatureInfo];
        signatureHelp.activeSignature = 0;

        if (parameters.length > 0) {
            const argumentsText = textBeforePosition.slice(openParenIndex + 1);
            const commaMatches = argumentsText.match(/,/g);
            const activeParameterIndex = commaMatches ? commaMatches.length : 0;
            signatureHelp.activeParameter = Math.min(activeParameterIndex, parameters.length - 1);
        } else {
            signatureHelp.activeParameter = 0;
        }

        return signatureHelp;
    }
}
