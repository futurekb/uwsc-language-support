import * as vscode from 'vscode';
import { UWSCCompletionProvider } from './providers/completionProvider';

export function activate(context: vscode.ExtensionContext) {
    const uwscSelector = { language: 'uwsc', scheme: 'file' };
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(uwscSelector, new UWSCCompletionProvider(), '.')
    );
}

export function deactivate() {}