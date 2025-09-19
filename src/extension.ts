import * as vscode from 'vscode';
import { UWSCCompletionProvider } from './providers/completionProvider';
import { UWSCHoverProvider } from './providers/hoverProvider';
import { UWSCSignatureHelpProvider } from './providers/signatureHelpProvider';

export function activate(context: vscode.ExtensionContext) {
    const uwscSelector = { language: 'uwsc', scheme: 'file' };

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(uwscSelector, new UWSCCompletionProvider())
    );

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(uwscSelector, new UWSCHoverProvider())
    );

    context.subscriptions.push(
        vscode.languages.registerSignatureHelpProvider(
            uwscSelector,
            new UWSCSignatureHelpProvider(),
            '(',
            ','
        )
    );
}

export function deactivate() {}
