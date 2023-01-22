import * as vscode from 'vscode';
import { localVersions, remoteVersions } from './caches';
import { clearAllDecorations } from './decorations';
import { handleEditor } from './editor';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, extension "package-versions" is now active!');

  vscode.window.visibleTextEditors.forEach(textEditor => {
    handleEditor(textEditor);
  });

  const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(textEditor => {
    if (textEditor !== undefined) {
      handleEditor(textEditor);
    }
  });

  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(textDocumentChangeEvent => {
    const textEditor = vscode.window.visibleTextEditors.find(
      editor => editor.document === textDocumentChangeEvent.document
    );
    if (textEditor) {
      handleEditor(textEditor);
    }
  });

  const clearCacheCommand = vscode.commands.registerCommand('package-versions.clear-cache', () => {
    remoteVersions.clear();
    localVersions.clear();
    vscode.window.visibleTextEditors.forEach(textEditor => {
      handleEditor(textEditor);
    });
  });

  context.subscriptions.push(clearCacheCommand, onDidChangeActiveTextEditor, onDidChangeTextDocument);
}

export function deactivate() {
  clearAllDecorations();
}
